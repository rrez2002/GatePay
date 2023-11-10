import { DetailInterface } from "../../contracts/interface";

export interface LocalDetail extends DetailInterface {
  failedPurchase?: boolean;
  cancel?: boolean;
}

export type VerifyDataType = {
  transactionId: string;
  cancel: boolean;
};

export type VerifyResponseType = {
  orderId: string;
  traceNo: string;
  referenceNo: string;
  cardNo: string;
};
