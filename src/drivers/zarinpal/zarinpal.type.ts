import { CurrencyType } from "../../contracts/type";

export type PurchaseDataType = {
  amount: number;
  merchant_id: string;
  callback_url: string;
  description: string;
  currency?: CurrencyType;
  metadata: {
    order_id: string;
    mobile: string;
    email?: string;
  };
};

export type PurchaseResponseType = {
  code: string;
  message: string;
  authority: string;
  fee_type: string;
  fee: string;
};

export type VerifyDataType = {
  merchant_id: string;
  authority: string;
  amount: number;
};

export type VerifyResponseType = {
  code: string;
  message: string;
  card_hash: string;
  card_pan: string;
  ref_id: string;
  fee_type: string;
  fee: string;
};
