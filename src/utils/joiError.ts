import { Schema } from 'joi';
import { APIError } from './sdkResponse';


export function validateOrThrow<T>(schema: Schema, data: T, context?: string): void {
  const { error } = schema.validate(data);
  if (error) {
    throw APIError({
         message: `[${context ?? 'Validation'}] ${error.message}`,
            statusCode: 422,
            errorCode: 'validation_error',
            details: error.details
    }
    );
  }
}