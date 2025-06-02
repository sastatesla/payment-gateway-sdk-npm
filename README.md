# Payment SDK

A unified Node.js/TypeScript SDK to handle payments via multiple gateways with a
single interface. Currently supports:

- ✅ Razorpay
- ✅ Cashfree

More providers coming soon!

---

## Features

- Unified API for multiple payment gateways
- Out-of-the-box support for **Razorpay** and **Cashfree**
- Extensible interface for adding more providers
- Standardized responses for success and errors
- Easily switch between gateways and standardize payment flows in your
  application.
- Supports charge, refund, status, settlement queries, and payment listing

---

## Installation

```bash
npm install payment-sdk
```

---

## Usage

### 1. Initialization

```typescript
import {PaymentManager} from "payment-sdk"

const config = {
	key_id: "YOUR_KEY_ID", // For Razorpay
	key_secret: "YOUR_KEY_SECRET", // For Razorpay
	client_id: "YOUR_CLIENT_ID", // For Cashfree
	client_secret: "YOUR_CLIENT_SECRET", // For Cashfree
	env: "TEST" // For Cashfree: 'TEST' or 'PROD'
}

const paymentManager = new PaymentManager("razorpay", config)
// or for Cashfree
// const paymentManager = new PaymentManager('cashfree', config);
```

### 2. Charge (Create Payment)

```typescript
const chargeInput = {
	amount: 50000, // in paise (Razorpay) or rupees*100 (Cashfree)
	currency: "INR",
	metadata: {
		customer_id: "user_1",
		email: "user@example.com",
		phone: "9876543210"
	}
}

const response = await paymentManager.charge(chargeInput)

if (response.success) {
	// handle success
} else {
	// handle error
}
```

### 3. Refund

```typescript
const refundInput = {
	amount: 50000,
	transactionId: "order_or_payment_id",
	metadata: {note: "Customer requested"}
}
const response = await paymentManager.refund(refundInput)
```

### 4. Get Payment Status

```typescript
const response = await paymentManager.getPaymentStatus("order_or_payment_id")
```

### 5. List Payments

```typescript
const userPayments = await paymentManager.listUserPayments("user_id")
const allPayments = await paymentManager.listAllPayments()
```

---

## Response Format

All methods return a standardized response:

#### Success

```json
{
  "success": true,
  "status": 200,
  "data": { ... },
  "message": "Optional success message"
}
```

#### Error

```json
{
  "success": false,
  "status": 400,
  "code": "internal_server_error",
  "message": "Error description",
  "details": { ... }
}
```

---

## Adding More Providers

Implement the `PaymentProvider` interface and add your provider to
`PaymentManager`.

---

## License

MIT

---

## Contributions

Issues and PRs welcome!
