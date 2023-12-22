import { DetailInterface } from "../../contracts/interface";

export interface SepDetail extends DetailInterface {
  ResNum: string;
  CellNumber: string;
  ResNum1: string;
  ResNum2: string;
  ResNum3: string;
  ResNum4: string;
}

export type PurchaseDataType = {
  Amount: number;
  action: string;
  TerminalId: string;
  ResNum: string;
  RedirectUrl: string;
  CellNumber: string;
  ResNum1?: string;
  ResNum2?: string;
  ResNum3?: string;
  ResNum4?: string;
};

export type PurchaseResponseType = {
  token: string;
  status: string;
  errorCode: string;
  errorDesc: string;
};

export type VerifyDataType = {
  TerminalNumber: string;
  RefNum: string;
};

export type VerifyResponseType = {
  success: boolean;
  ResultCode: number;
  ResultDescription: string;
  TransactionDetail: VerifyInfo;
};

type VerifyInfo = {
  RRN: string;
  RefNum: string;
  MaskedPan: string;
  HashedPan: string;
  terminalNumber: number;
  OrginalAmount: number;
  AffectiveAmount: number;
  StraceDate: number;
  StraceNo: number;
};
