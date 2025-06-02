import {SdkSuccessResponse, SdkErrorResponse} from "../types"

export function APISuccess<T>(
	data: T,
	status: number = 200,
	message?: string
): SdkSuccessResponse<T> {
	return {
		success: true,
		status: 200,
		data,
		...(message ? {message} : {})
	}
}

export function APIError(data: {
	message?: string
	statusCode?: number
	errorCode?: string
	details?: any
}): SdkErrorResponse {
	const status = data.statusCode ?? 422

	let code = data.errorCode
	if (!code) {
		switch (status) {
			case 400:
				code = "unexpected_error"
				break
			case 401:
				code = "unauthorized"
				break
			case 403:
				code = "not_enough_permissions"
				break
			case 404:
				code = "not_found"
				break
			default:
				code = "internal_server_error"
				break
		}
	}

	return {
		success: false,
		status,
		message: data.message ?? "An unexpected error occurred.",
		code,
		...(data.details ? {details: data.details} : {})
	}
}
