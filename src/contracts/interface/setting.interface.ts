export interface Setting {
  merchantId: string;
  apiPaymentUrl: string;
  apiPurchaseUrl: string;
  callbackUrl: string;
  apiVerificationUrl: string;

  phone?: string;
  email?: string;
  description?: string;
  validCardNumber?: string;
}
