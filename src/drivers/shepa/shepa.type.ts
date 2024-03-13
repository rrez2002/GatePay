import { DetailInterface } from "../../contracts/interface";

export interface ShepaDetail extends DetailInterface {
  amount: number;
  mobile?: string;
  email?: string;
  cardnumber?: string;
  description?: string;
}

export type PurchaseDataType = {
  api: string;
  amount: number;
  callback: string;
  mobile?: string;
  email?: string;
  cardnumber?: string;
  description?: string;
};

export type PurchaseResponseType = {
  success: string;
  result: {
    token: string;
    url: string;
  }
  errors: string;
};

export type VerifyDataType = {
  api: string;
  token: string;
  amount: number;
};

export type VerifyResponseType = {
  success: string;
  result: {
    refid: number;
    transaction_id: number;
    amount: number;
    card_pan: string;
    date: Date;
  }
  errors: string;
};



export type RefundDataType = {
  api: string;
  transaction_id: string;
  amount: number;
};

export type RefundResponseType = {
  success: string;
  result: {

  }
  errors: string;
};

