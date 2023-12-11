import { DetailInterface } from "../../contracts/interface";

export interface PaypingDetail extends DetailInterface {
  description?: string;
  payerName?: string;
  payerIdentity?: string;
}

export type PurchaseDataType = {
  amount: number;
  clientRefId: string;
  returnUrl: string;
  description?: string;
  payerName?: string;
  payerIdentity?: string;
};

export type PurchaseResponseType = {
  code: string;
};

export type VerifyDataType = {
  refId: string;
  amount: number;
};

export type VerifyResponseType = {
  amount: string;
  cardNumber: string;
  cardHashPan: string;
};
