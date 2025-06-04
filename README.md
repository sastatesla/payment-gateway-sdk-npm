# PaymentManager SDK

A unified interface for integrating multiple payment providers (e.g., Razorpay,
Cashfree) in your Node.js application.

## Features

- Plug-and-play support for multiple payment providers.
- Consistent API for charging, refunding, querying payment and settlement
  status, and listing payments.
- Easy to extend for other providers (just implement the `PaymentProvider`
  abstract class).
- Input validation and error normalization.

---

## Installation

```bash
npm install @sastatesla/payment-gateway-sdk
```

---

## Usage

### 1. Initialize the SDK in your code:

```typescript
import {PaymentManager} from "@sastatesla/payment-gateway-sdk"
```

### 2. Configure Provider

Prepare your provider config. For example, for Razorpay:

```typescript
const razorpayConfig = {
	keyId: "YOUR_RAZORPAY_KEY_ID",
	keySecret: "YOUR_RAZORPAY_KEY_SECRET"
}

const paymentManager = new PaymentManager("razorpay", razorpayConfig)
```

Or for Cashfree:

```typescript
const cashfreeConfig = {
	clientId: "YOUR_CASHFREE_CLIENT_ID",
	clientSecret: "YOUR_CASHFREE_CLIENT_SECRET",
	environment: "TEST"
}

const paymentManager = new PaymentManager("cashfree", cashfreeConfig)
```

### 3. Charging a User

```typescript
const chargeInput = {
	amount: 10000, // in smallest currency unit, e.g., paise
	currency: "INR",
	metadata: {userId: "USER123", notes: "Order #1001"}
}

const chargeResult = await paymentManager.charge(chargeInput)
console.log(chargeResult)
```

### 4. Refunding a Payment

```typescript
const refundInput = {
	transactionId: "PAYMENT_ID",
	amount: 5000
}

const refundResult = await paymentManager.refund(refundInput)
console.log(refundResult)
```

### 5. Checking Payment Status

```typescript
const paymentStatus = await paymentManager.getPaymentStatus("PAYMENT_ID")
console.log(paymentStatus)
```

### 6. Listing User Payments

```typescript
const userPayments = await paymentManager.listUserPayments("USER123", {
	fromDate: "2024-01-01",
	toDate: "2024-12-31",
	status: "captured"
})
console.log(userPayments)
```

### 7. Listing All Payments

```typescript
const allPayments = await paymentManager.listAllPayments({
	fromDate: "2024-01-01",
	toDate: "2024-12-31"
})
console.log(allPayments)
```

### 8. Getting Settlement Details

```typescript
const settlementDetails =
	await paymentManager.getSettlementDetails("SETTLEMENT_ID")
console.log(settlementDetails)
```

### 9. Checking Refund Status

```typescript
const refundStatus = await paymentManager.getRefundStatus("REFUND_ID")
console.log(refundStatus)
```

---

## Extending for New Providers

1. **Implement `PaymentProvider` Abstract Class**  
   Create a new provider class extending `PaymentProvider` and implement all
   required abstract methods.

2. **Add Switch Case in `PaymentManager`**  
   Add a case for your new provider in the `PaymentManager` constructor.

---

## Error Handling

All errors are normalized using the `APIError` utility and thrown as exceptions.
Catch them in your application to handle gracefully.

---

## Types

All methods use strong TypeScript types. Refer to the `types` module for details
on `ChargeInput`, `RefundInput`, `ChargeResult`, etc.

---

## Example

```typescript
import {PaymentManager} from "@sastatesla/payment-gateway-sdk"

async function main() {
	const config = {keyId: "xxx", keySecret: "yyy"}
	const manager = new PaymentManager("razorpay", config)

	// Charge
	const charge = await manager.charge({
		amount: 10000,
		currency: "INR",
		metadata: {userId: "1"}
	})
	console.log("Charge:", charge)

	// Payment Status
	const status = await manager.getPaymentStatus(charge.id)
	console.log("Status:", status)
}

main().catch(console.error)
```

---

## License

MIT

## Contributions

Issues and PRs welcome!
