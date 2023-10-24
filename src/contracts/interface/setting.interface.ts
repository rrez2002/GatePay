export interface Setting {
  readonly apiPaymentUrl: string;
  readonly apiPurchaseUrl: string;
  readonly apiVerificationUrl: string;
  callbackUrl: string;
  merchantId: string;
}

export interface Detail {
  name?: string;
  phone?: string;
  email?: string;
  description?: string;
}
