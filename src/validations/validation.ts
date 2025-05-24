import Joi from 'joi';

export const chargeSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
  currency: Joi.string().length(3).uppercase().required(),
  source: Joi.string().required(),
  metadata: Joi.object().optional(),
});

export const refundSchema = Joi.object({
  transactionId: Joi.string().required(),
  amount: Joi.number().integer().min(1).optional(),
});

export const paymentStatusSchema = Joi.object({
  paymentId: Joi.string().required(),
});

export const listUserPaymentsSchema = Joi.object({
  userId: Joi.string().required(),
  filters: Joi.object({
    status: Joi.string().valid('created', 'authorized', 'captured', 'failed', 'refunded').optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
  }).optional(),
});

export const listAllPaymentsSchema = Joi.object({
  filters: Joi.object({
    status: Joi.string().valid('created', 'authorized', 'captured', 'failed', 'refunded').optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
  }).optional(),
});

export const settlementDetailsSchema = Joi.object({
  settlementId: Joi.string().required(),
});

export const refundStatusSchema = Joi.object({
  refundId: Joi.string().required(),
});