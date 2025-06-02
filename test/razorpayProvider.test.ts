import { RazorpayProvider } from '../src/providers/razorpay';

const mockConfig = {
  keyId: 'test_key',
  keySecret: 'test_secret',
};

describe('RazorpayProvider', () => {
  let provider: RazorpayProvider;

  beforeEach(() => {
    provider = new RazorpayProvider(mockConfig);
  });

  it('should create an order successfully via charge()', async () => {
    const result = await provider.charge({
      amount: 1000,
      currency: 'INR',
      source: 'test_source',
      metadata: { userId: 'user_1' },
    });

    expect(result).toHaveProperty('id');
    expect(result.amount).toBe(1000);
  });

  it('should refund a payment successfully', async () => {
    const result = await provider.refund({
      transactionId: 'txn_123',
      amount: 1000,
    });

    expect(result).toHaveProperty('id');
    expect(result.amount).toBe(1000);
  });

  it('should fetch payment status', async () => {
    const result = await provider.getPaymentStatus('payment_123');
    expect(result).toHaveProperty('id', 'payment_123');
  });
});
