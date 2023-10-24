export type PurchaseDataType = {
  amount: number;
  api: string;
  redirect: string;
  description?: string;
  factorNumber: string;
  mobile?: string;
  validCardNumber?: string;
};

export type PurchaseResponseType = {
  status: string;
  token: string;
};

export type VerifyDataType = {
  token: string;
  api: string;
};

export type VerifyResponseType = {
  status: string;
  amount: string;
  transId: string;
  factorNumber: string;
  mobile: string;
  description: string;
  cardNumber: string;
  message: string;
};
