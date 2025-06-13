import {PaymentProvider} from "./providers/paymentProvider"
import {RazorpayProvider} from "./providers/index"
import {CashfreeProvider} from "./providers/cashfree"
import {ProviderName, PaymentManagerConfig} from "./types"
import {parsePaymentManagerConfig} from "./utils/inputParser"

export class PaymentManager {
	private providerInstance: PaymentProvider

	private constructor(providerInstance: PaymentProvider) {
		this.providerInstance = providerInstance
	}

	public static init(config: PaymentManagerConfig): PaymentManager {
		const validatedConfig = parsePaymentManagerConfig(config)

		switch (config.provider) {
			case "razorpay":
				return new PaymentManager(
					// @ts-ignore
					new RazorpayProvider(config.config)
				)
			case "cashfree":
				return new PaymentManager(
					// @ts-ignore
					new CashfreeProvider(config.config)
				)
			case "stripe":
				return new PaymentManager(new StripeProvider(config.config))
			default:
				throw new Error("Unsupported provider")
		}
	}

	public charge(
		...args: Parameters<PaymentProvider["charge"]>
	): ReturnType<PaymentProvider["charge"]> {
		return this.providerInstance.charge(...args)
	}

	public refund(
		...args: Parameters<PaymentProvider["refund"]>
	): ReturnType<PaymentProvider["refund"]> {
		return this.providerInstance.refund(...args)
	}

	public getPaymentStatus(
		...args: Parameters<PaymentProvider["getPaymentStatus"]>
	): ReturnType<PaymentProvider["getPaymentStatus"]> {
		return this.providerInstance.getPaymentStatus(...args)
	}

	public listUserPayments(
		...args: Parameters<PaymentProvider["listUserPayments"]>
	): ReturnType<PaymentProvider["listUserPayments"]> {
		return this.providerInstance.listUserPayments(...args)
	}

	public listAllPayments(
		...args: Parameters<PaymentProvider["listAllPayments"]>
	): ReturnType<PaymentProvider["listAllPayments"]> {
		return this.providerInstance.listAllPayments(...args)
	}

	public getSettlementDetails(
		...args: Parameters<PaymentProvider["getSettlementDetails"]>
	): ReturnType<PaymentProvider["getSettlementDetails"]> {
		return this.providerInstance.getSettlementDetails(...args)
	}

	public getRefundStatus(
		...args: Parameters<PaymentProvider["getRefundStatus"]>
	): ReturnType<PaymentProvider["getRefundStatus"]> {
		return this.providerInstance.getRefundStatus(...args)
	}
}
