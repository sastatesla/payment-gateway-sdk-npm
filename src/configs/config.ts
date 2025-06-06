import dotenv from "dotenv"
import path from "path"
import Joi from "joi"

dotenv.config()
const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid("production", "development", "test")
			.required(),

		PORT: Joi.number().default(3000),

		// JWT
		JWT_SECRET: Joi.string().required().description("JWT secret key"),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10)
	})
	.unknown()

const {value: envVars, error} = envVarsSchema
	.prefs({errors: {label: "key"}})
	.validate(process.env)

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

const config = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes:
			envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		verifyEmailExpirationMinutes:
			envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
	},
	email: {
		smtp: {
			host: envVars.SMTP_HOST,
			port: envVars.SMTP_PORT,
			auth: {
				user: envVars.SMTP_USERNAME,
				pass: envVars.SMTP_PASSWORD
			}
		},
		from: envVars.EMAIL_FROM
	},
	db: {
		protocol: envVars.DB_PROTOCOL,
		user: envVars.DB_USER,
		password: envVars.DB_PASSWORD,
		host: envVars.DB_HOST,
		port: envVars.DB_PORT,
		mainDbName: envVars.MAIN_DB_NAME
	}
}

export default config
