import {
	ChargeInput,
	ChargeResult,
	RefundInput,
	RefundResult,
	PaymentStatusResult,
	ListPaymentsFilter,
	SettlementDetails
} from "../types/index"

export abstract class PaymentProvider {
	public abstract initialize(config: any): Promise<void>
	public abstract charge(input: ChargeInput): Promise<ChargeResult>
	public abstract refund(input: RefundInput): Promise<RefundResult>
	public abstract getPaymentStatus(
		paymentId: string
	): Promise<PaymentStatusResult>
	public abstract listUserPayments(
		userId: string,
		filters?: ListPaymentsFilter
	): Promise<ChargeResult[]>
	public abstract listAllPayments(
		filters?: ListPaymentsFilter
	): Promise<ChargeResult[]>
	public abstract getSettlementDetails(
		settlementId: string
	): Promise<SettlementDetails>
	public abstract getRefundStatus(refundId: string): Promise<RefundResult>
}
