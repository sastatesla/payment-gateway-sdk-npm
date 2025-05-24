import { PaymentProvider } from './providers/paymentProvider'; 
import { RazorpayProvider } from './providers/index';
import { ProviderName } from './types';

export class PaymentManager {
  private provider: PaymentProvider;

  constructor(providerName: ProviderName, config: any) {
    switch (providerName) {
      case 'razorpay':
        this.provider = new RazorpayProvider(config);
        break;
      // case 'paypal':
      //   this.provider = new PayPalProvider(config);
      //   break;
      default:
        throw new Error('Unsupported provider');
    }
	this.provider.initialize(config);
  }

  public async charge(...args: Parameters<PaymentProvider['charge']>) {
    return this.provider.charge(...args);
  }

  public async refund(...args: Parameters<PaymentProvider['refund']>) {
    return this.provider.refund(...args);
  }

  public async getPaymentStatus(...args: Parameters<PaymentProvider['getPaymentStatus']>) {
    return this.provider.getPaymentStatus(...args);
  }

  public async listUserPayments(...args: Parameters<PaymentProvider['listUserPayments']>) {
    return this.provider.listUserPayments(...args);
  }

  public async listAllPayments(...args: Parameters<PaymentProvider['listAllPayments']>) {
    return this.provider.listAllPayments(...args);
  }

  public async getSettlementDetails(...args: Parameters<PaymentProvider['getSettlementDetails']>) {
    return this.provider.getSettlementDetails(...args);
  }

  public async getRefundStatus(...args: Parameters<PaymentProvider['getRefundStatus']>) {
    return this.provider.getRefundStatus(...args);
  }
}