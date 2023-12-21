import { DetailInterface } from "../../contracts/interface";

export interface AtipayDetail extends DetailInterface {
  amount: number;
  invoiceNumber: string;
  redirectUrl: string;
  description?: string;
  cellNumber?: string;
  scatteredSettlementItems?: ScatteredSettlementItem[];
}

type ScatteredSettlementItem = {
  amount: number;
  iban: string;
};

export type PurchaseDataType = {
  apiKey: string;
  amount: number;
  invoiceNumber: string;
  redirectUrl: string;
  description?: string;
  cellNumber?: string;
  scatteredSettlementItems?: ScatteredSettlementItem[];
};

export type PurchaseResponseType = {
  status: string;
  token: string;
  errorCode: string;
  errorDescription: string;
};

export type VerifyDataType = {
  apiKey: string;
  referenceNumber: string;
};

export type VerifyResponseType = {
  amount: number;
  //
  state: string;
  status: string;
  referenceNumber: string;
  reservationNumber: string;
  terminalId: string;
  traceNumber: string;
  maskedPan: string;
  rrn: string;
};
