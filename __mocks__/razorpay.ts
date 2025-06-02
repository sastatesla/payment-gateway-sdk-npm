const createMockFn = (returns = {}) => jest.fn().mockResolvedValue(returns);

const Razorpay = jest.fn().mockImplementation(() => ({
  orders: {
    create: createMockFn({ id: 'order_123', amount: 1000, created_at: Date.now() / 1000 }),
  },
  payments: {
    refund: createMockFn({ id: 'refund_123', amount: 1000, created_at: Date.now() / 1000 }),
    fetch: createMockFn({ id: 'payment_123', status: 'captured' }),
    all: createMockFn({ items: [] }),
  },
  settlements: {
    fetch: createMockFn({ id: 'settlement_123', amount: 1000 }),
  },
  refunds: {
    fetch: createMockFn({ id: 'refund_123', amount: 1000, created_at: Date.now() / 1000 }),
  },
  virtualAccounts: {
    fetch: createMockFn({ id: 'va_123', status: 'active' }),
  },
}));

export default Razorpay;
