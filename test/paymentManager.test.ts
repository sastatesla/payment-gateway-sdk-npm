import {PaymentManager} from "../src/gateways-manager"
import {ProviderName} from "../src/types"

describe("PaymentManager", () => {
	let manager: PaymentManager

	beforeEach(() => {
		manager = new PaymentManager("razorpay" as ProviderName, {
			keyId: "test_key",
			keySecret: "test_secret"
		})
	})

	it("should initialize and charge successfully", async () => {
		const result = await manager.charge({
			amount: 1000,
			currency: "INR",
			source: "test_source",
			metadata: {userId: "user_1"}
		})

		expect(result).toHaveProperty("id")
		expect(result.amount).toBe(1000)
	})
})
