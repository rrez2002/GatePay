export type PurchaseDataType = {
  amount: number;
  merchant: string;
  callbackUrl: string;
  description: string;
  orderId: string;
  mobile: string;
};

export type PurchaseResponseType = {
  result: string;
  trackId: string;
  message: string;
  payLink: string;
};

export type VerifyDataType = {
  trackId: string;
  merchant: string;
};

export type VerifyResponseType = {
  result: string;
  amount: number;
  paidAt: Date;
  cardNumber: string;
  status: number;
  refNumber: string;
  description: string;
  orderId: string;
  message: string;
};
