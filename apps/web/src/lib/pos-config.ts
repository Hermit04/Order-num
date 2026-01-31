// POS System Configuration

export const POS_CONFIG = {
  // Tax configuration
  DEFAULT_TAX_RATE: 0.1, // 10% default tax rate
  
  // Subscription configuration
  SUBSCRIPTION_DURATION_DAYS: 30,
  
  // Sale number configuration
  SALE_NUMBER_PREFIX: "SALE-",
  
  // Inventory alerts
  LOW_STOCK_THRESHOLD_MULTIPLIER: 1.0, // Alert when quantity <= minQuantity * this multiplier
  
  // Reports configuration
  DEFAULT_REPORT_DAYS: 30,
  REPORT_PERIOD_OPTIONS: [7, 30, 90],
} as const;

// Store-specific configurations can be extended here
export interface StoreConfig {
  storeId: string;
  taxRate?: number; // Override default tax rate per store
  currency?: string;
  timezone?: string;
}
