import Razorpay from "razorpay"
import {
	ChargeInput,
	ChargeResult,
	RefundInput,
	RefundResult,
	PaymentStatusResult,
	ListPaymentsFilter,
	SettlementDetails,
	RazorpayConfig
} from "../types/index"
import {
	chargeSchema,
	refundSchema,
	paymentStatusSchema,
	listUserPaymentsSchema,
	listAllPaymentsSchema,
	settlementDetailsSchema,
	refundStatusSchema
} from "../validations/validation"
import {validateOrThrow} from "../utils/joiError"
import {APIError} from "../utils/sdkResponse"
import {PaymentProvider} from "./paymentProvider"

export class RazorpayProvider extends PaymentProvider {
	public async initialize(config: RazorpayConfig): Promise<void> {
		try {
			this.razorpay = new Razorpay({
				key_id: config.keyId,
				key_secret: config.keySecret
			})
		} catch (err: any) {
			throw APIError({
				message: `[RazorpayProvider Initialize] ${err.message}`
			})
		}
	}
	private razorpay: Razorpay

	constructor(config: RazorpayConfig) {
		super()
		try {
			this.razorpay = new Razorpay({
				key_id: config.keyId,
				key_secret: config.keySecret
			})
		} catch (err: any) {
			throw APIError({
				message: `[RazorpayProvider Constructor] ${err.message}`
			})
		}
	}

	public async charge(input: ChargeInput): Promise<ChargeResult> {
		validateOrThrow(chargeSchema, input, "charge")
		try {
			const order = await this.razorpay.orders.create({
				amount: input.amount,
				currency: input.currency,
				receipt: input.metadata?.receipt || `rcpt_${Date.now()}`,
				payment_capture: true,
				notes: input.metadata || {}
			})
			return {
				...order,
				amount: Number(order.amount),
				createdAt: new Date(order.created_at * 1000).toISOString()
			}
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay Charge] ${err.message}`
			})
		}
	}

	public async refund(input: RefundInput): Promise<RefundResult> {
		validateOrThrow(refundSchema, input, "refund")
		try {
			const params: {amount?: number} = {}
			if (input.amount) params.amount = input.amount
			const refund = await this.razorpay.payments.refund(
				input.transactionId,
				params
			)
			return {
				...refund,
				amount: Number(refund.amount),
				createdAt: new Date(refund.created_at * 1000).toISOString()
			}
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay Refund] ${err.message}`,
				errorCode: err.code || "RAZORPAY_REFUND_ERROR",
				details: err
			})
		}
	}

	public async getPaymentStatus(paymentId: string) {
		validateOrThrow(paymentStatusSchema, {paymentId}, "getPaymentStatus")
		try {
			const payment = await this.razorpay.payments.fetch(paymentId)
			return {...payment}
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay GetPaymentStatus] ${err.message}`
			})
		}
	}

	public async listUserPayments(
		userId: string,
		filters?: ListPaymentsFilter
	) {
		validateOrThrow(
			listUserPaymentsSchema,
			{userId, filters},
			"listUserPayments"
		)
		try {
			const params: any = {
				from: filters?.fromDate
					? new Date(filters.fromDate).getTime() / 1000
					: undefined,
				to: filters?.toDate
					? new Date(filters.toDate).getTime() / 1000
					: undefined,
				count: 100
			}
			const allPayments = await this.razorpay.payments.all(params)
			const results = allPayments.items.filter(
				(p: any) =>
					p.notes &&
					p.notes.userId === userId &&
					(!filters?.status || p.status === filters.status)
			)
			return results.map((p: any) => ({
				id: p.id,
				status: p.status,
				amount: p.amount,
				currency: p.currency,
				createdAt: new Date(p.created_at * 1000).toISOString(),
				...p
			}))
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay ListUserPayments] ${err.message}`,
				errorCode: err.code || "RAZORPAY_LIST_USER_PAYMENTS_ERROR",
				details: err
			})
		}
	}

	public async listAllPayments(filters?: ListPaymentsFilter) {
		validateOrThrow(listAllPaymentsSchema, {filters}, "listAllPayments")
		try {
			const params: any = {
				from: filters?.fromDate
					? new Date(filters.fromDate).getTime() / 1000
					: undefined,
				to: filters?.toDate
					? new Date(filters.toDate).getTime() / 1000
					: undefined,
				count: 100
			}
			const allPayments = await this.razorpay.payments.all(params)
			let results = allPayments.items
			if (filters?.status) {
				results = results.filter(
					(p: any) => p.status === filters.status
				)
			}
			return results.map((p: any) => ({
				id: p.id,
				status: p.status,
				amount: p.amount,
				currency: p.currency,
				createdAt: new Date(p.created_at * 1000).toISOString(),
				...p
			}))
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay ListAllPayments] ${err.message}`,
				errorCode: err.code || "RAZORPAY_LIST_ALL_PAYMENTS_ERROR",
				details: err
			})
		}
	}

	public async getSettlementDetails(
		settlementId: string
	): Promise<SettlementDetails> {
		validateOrThrow(
			settlementDetailsSchema,
			{settlementId},
			"getSettlementDetails"
		)
		try {
			const settlement =
				await this.razorpay.settlements.fetch(settlementId)
			return {
				...settlement,
				amount: Number(settlement.amount)
			}
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay GetSettlementDetails] ${err.message}`
			})
		}
	}

	public async getRefundStatus(refundId: string): Promise<RefundResult> {
		validateOrThrow(refundStatusSchema, {refundId}, "getRefundStatus")
		try {
			const refund = await this.razorpay.refunds.fetch(refundId)
			return {
				...refund,
				amount: Number(refund.amount),
				createdAt: new Date(refund.created_at * 1000).toISOString()
			}
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay GetRefundStatus] ${err.message}`
			})
		}
	}

	// Provider-specific method (not in abstract)
	public async fetchVirtualAccountDetails(accountId: string) {
		try {
			return await this.razorpay.virtualAccounts.fetch(accountId)
		} catch (err: any) {
			throw APIError({
				message: `[Razorpay FetchVirtualAccountDetails] ${err.message}`
			})
		}
	}
}
