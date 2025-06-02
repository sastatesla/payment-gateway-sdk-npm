import Cashfree from 'cashfree-pg'
import {
  ChargeInput,
  ChargeResult,
  RefundInput,
  RefundResult,
  PaymentStatusResult,
  ListPaymentsFilter,
  SettlementDetails,
  CashfreeConfig,
} from '../types/index'
import {
  chargeSchema,
  refundSchema,
  paymentStatusSchema,
  listUserPaymentsSchema,
  listAllPaymentsSchema,
  settlementDetailsSchema,
  refundStatusSchema,
} from '../validations/validation'
import { validateOrThrow } from '../utils/joiError'
import { APIError } from '../utils/sdkResponse'
import { PaymentProvider } from './paymentProvider'


export class CashfreeProvider extends PaymentProvider {
  private cashfree: any

  public async initialize(config: CashfreeConfig): Promise<void> {
    try {
    // @ts-ignore
      this.cashfree = new Cashfree.PG({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        env: config.env || 'PROD',
      })
    } catch (err: any) {
      throw APIError({
        message: `[CashfreeProvider Initialize] ${err.message}`,
      })
    }
  }

  constructor(config: CashfreeConfig) {
    super()
    try {
     // @ts-ignore
      this.cashfree = new Cashfree.PG({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        env: config.env || 'PROD',
      })
    } catch (err: any) {
      throw APIError({
        message: `[CashfreeProvider Constructor] ${err.message}`,
      })
    }
  }

  public async charge(input: ChargeInput): Promise<ChargeResult> {
    validateOrThrow(chargeSchema, input, 'charge')
    try {
      const orderRequest = {
        order_id: input.metadata?.orderId || `order_${Date.now()}`,
        order_amount: input.amount / 100, 
        order_currency: input.currency,
        customer_details: {
          customer_id: input.metadata?.customerId || `cust_${Date.now()}`,
          customer_email: input.metadata?.email,
          customer_phone: input.metadata?.phone,
        },
        order_meta: input.metadata || {},
        order_note: input.metadata?.note,
      }

      const order = await this.cashfree.orders.create(orderRequest)
      return {
        ...order,
        amount: Number(order.order_amount) * 100, 
        createdAt: new Date(order.created_time).toISOString(),
      }
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree Charge] ${err.message}`,
      })
    }
  }

  public async refund(input: RefundInput): Promise<RefundResult> {
    validateOrThrow(refundSchema, input, 'refund')
    try {
      const refundRequest = {
        refund_amount: input.amount ? input.amount / 100 : undefined, 
        refund_id: input.transactionId || `refund_${Date.now()}`,
        refund_note: input?.note,
      }
      const refund = await this.cashfree.refunds.create(input.transactionId, refundRequest)
      return {
        ...refund,
        amount: Number(refund.refund_amount) * 100,
        createdAt: new Date(refund.refund_time).toISOString(),
      }
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree Refund] ${err.message}`,
        errorCode: err.code || 'CASHFREE_REFUND_ERROR',
        details: err,
      })
    }
  }

  public async getPaymentStatus(paymentId: string) {
    validateOrThrow(paymentStatusSchema, { paymentId }, 'getPaymentStatus')
    try {
      const payment = await this.cashfree.payments.get(paymentId)
      return { ...payment }
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree GetPaymentStatus] ${err.message}`,
      })
    }
  }

  public async listUserPayments(userId: string, filters?: ListPaymentsFilter) {
    validateOrThrow(listUserPaymentsSchema, { userId, filters }, 'listUserPayments')
    try {
      const params: any = {
        from_time: filters?.fromDate ? new Date(filters.fromDate).toISOString() : undefined,
        to_time: filters?.toDate ? new Date(filters.toDate).toISOString() : undefined,
        per_page: 100,
      }
      const allPayments = await this.cashfree.orders.list(params)
      const results = allPayments.data.filter(
        (p: any) =>
          p.customer_details && p.customer_details.customer_id === userId &&
          (!filters?.status || p.order_status === filters.status)
      )
      return results.map((p: any) => ({
        id: p.order_id,
        status: p.order_status,
        amount: Number(p.order_amount) * 100,
        currency: p.order_currency,
        createdAt: new Date(p.created_time).toISOString(),
        ...p,
      }))
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree ListUserPayments] ${err.message}`,
        errorCode: err.code || 'CASHFREE_LIST_USER_PAYMENTS_ERROR',
        details: err,
      })
    }
  }

  public async listAllPayments(filters?: ListPaymentsFilter) {
    validateOrThrow(listAllPaymentsSchema, { filters }, 'listAllPayments')
    try {
      const params: any = {
        from_time: filters?.fromDate ? new Date(filters.fromDate).toISOString() : undefined,
        to_time: filters?.toDate ? new Date(filters.toDate).toISOString() : undefined,
        per_page: 100,
      }
      const allPayments = await this.cashfree.orders.list(params)
      let results = allPayments.data
      if (filters?.status) {
        results = results.filter((p: any) => p.order_status === filters.status)
      }
      return results.map((p: any) => ({
        id: p.order_id,
        status: p.order_status,
        amount: Number(p.order_amount) * 100,
        currency: p.order_currency,
        createdAt: new Date(p.created_time).toISOString(),
        ...p,
      }))
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree ListAllPayments] ${err.message}`,
        errorCode: err.code || 'CASHFREE_LIST_ALL_PAYMENTS_ERROR',
        details: err,
      })
    }
  }

  public async getSettlementDetails(settlementId: string): Promise<SettlementDetails> {
    validateOrThrow(settlementDetailsSchema, { settlementId }, 'getSettlementDetails')
    try {
      const settlement = await this.cashfree.settlements.get(settlementId)
      return {
        ...settlement,
        amount: Number(settlement.amount) * 100,
      }
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree GetSettlementDetails] ${err.message}`,
      })
    }
  }

  public async getRefundStatus(refundId: string): Promise<RefundResult> {
    validateOrThrow(refundStatusSchema, { refundId }, 'getRefundStatus')
    try {
      const refund = await this.cashfree.refunds.get(refundId)
      return {
        ...refund,
        amount: Number(refund.refund_amount) * 100,
        createdAt: new Date(refund.refund_time).toISOString(),
      }
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree GetRefundStatus] ${err.message}`,
      })
    }
  }

  // Provider-specific method (not in abstract)
  public async fetchVirtualAccountDetails(accountId: string) {
    try {
      return await this.cashfree.virtualAccounts.get(accountId)
    } catch (err: any) {
      throw APIError({
        message: `[Cashfree FetchVirtualAccountDetails] ${err.message}`,
      })
    }
  }
}