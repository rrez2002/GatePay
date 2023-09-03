export interface Setting {
  merchantId: number;
  apiPaymentUrl: string;
  apiPurchaseUrl: string;
  callbackUrl: string;
  apiVerificationUrl: string;

  phone?: string;
  email?: string;
  description?: string;
  validCardNumber?: string;
}
