import { DetailInterface } from "../../contracts/interface";

export interface ZibalDetail extends DetailInterface {
  description: string;
  orderId?: string;
  mobile?: string;
  allowedCards?: string;
  ledgerId?: string;
  linkToPay?: boolean;
  sms?: boolean;
}

export type PurchaseDataType = {
  amount: number;
  merchant: string;
  description: string;
  callbackUrl: string;
  orderId?: string;
  mobile?: string;
  allowedCards?: string;
  ledgerId?: string;
  linkToPay?: boolean;
  sms?: boolean;
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
