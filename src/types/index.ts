import { OrderDir, Range } from "./common";

export type Currency = 'INR' | 'USD' | 'EUR' | string;

export type PaymentStatus = 'created' | 'attempted' | 'paid' | 'authorized' | 'captured' | 'failed' | 'refunded';

export type RefundStatus = 'initiated' | 'processed'|'pending' | 'failed';

export type ProviderName = 'razorpay' | 'cashfree' | 'paytm' | 'phonePe' |  'stripe' | string;

export type ChargeInput = {
  amount: number; 
  currency: Currency;
  source: string; 
  metadata?: Record<string, any>;
}

export type ChargeResult = {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  createdAt: string;
  [key: string]: any;
}

export type RefundInput = {
  transactionId: string;
  amount?: number;
  note?: string;
}

export type RefundResult = {
  id: string;
  status: RefundStatus;
  amount: number;
  createdAt: string;
  [key: string]: any;
}

export type PaymentStatusResult = {
  id: string;
  status: PaymentStatus;
  [key: string]: any;
}

export type ListPaymentsFilter = {
  userId?: string;
  status?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  [key: string]: any;
  range?: Range;
  OrderDir?:OrderDir
}

export type SettlementDetails = {
  id: string;
  amount: number;
  status: string;
  settledAt?: string;
  [key: string]: any;
}

export type SdkSuccessResponse<T = any> ={
  success: true;
  status: number;
  data: T;
  message?: string;
}

export type SdkErrorResponse = {
  success: false;
  status: number;
  code: string;
  message: string;
  details?: any;
}

export type CashfreeConfig = {
  clientId: string
  clientSecret: string
  env?: 'PROD' | 'TEST'
}

export type RazorpayConfig = {
  keyId: string
  keySecret: string
  env?: 'PROD' | 'TEST'
}