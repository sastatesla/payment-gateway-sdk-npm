import {PaymentManagerConfig} from "../types"
import {APIError} from "./sdkResponse"
import {any} from "joi"
import {paymentManagerConfigSchema} from "../validations/validation"

export function parsePaymentManagerConfig(input: any): PaymentManagerConfig {
	const {value, error} = paymentManagerConfigSchema.validate(input || {})
	if (error)
		throw APIError({
			message: `[Configuration Error] ${error.message}`
		})
	return value as PaymentManagerConfig
}
