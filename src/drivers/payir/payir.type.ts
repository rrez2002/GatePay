export type PurchaseResponseType = {
  status: string;
  token: string;
};

export type VerifyResponseType = {
  status: number;
  amount: string;
  transId: string;
  factorNumber: string;
  mobile: string;
  description: string;
  cardNumber: string;
  message: string;
};
