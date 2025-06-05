import {PaymentManager} from "../src/gateways-manager"
import {ProviderName, ChargeInput, RefundInput} from "../src/types"

describe("PaymentManager", () => {
	let manager: PaymentManager

	beforeEach(() => {
		manager = PaymentManager.init({
			provider: "razorpay" as ProviderName,
			config: {
				keyId: "test_key",
				keySecret: "test_secret"
			}
		})
	})

	it("should initialize and charge successfully", async () => {
		const result = await manager.charge({
			amount: 1000,
			currency: "INR",
			source: "test_source",
			metadata: {userId: "user_1"}
		} as ChargeInput)

		expect(result).toHaveProperty("id")
		expect(result.amount).toBe(1000)
	})

	it("should refund successfully", async () => {
		const result = await manager.refund({
			transactionId: "txn_123",
			amount: 1000,
			note: "Test refund"
		} as RefundInput)

		expect(result).toHaveProperty("id")
		expect(result.amount).toBe(1000)
	})
})
