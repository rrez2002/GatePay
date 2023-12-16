import { DetailInterface, Setting } from "../../contracts/interface";

export interface IdpaySetting extends Setting {
  sandbox?: boolean;
}

export interface IdpayDetail extends DetailInterface {
  amount: number;
  order_id: string;
  callback: string;
  desc?: string;
  name?: string;
  phone?: string;
  mail?: string;
}

export type PurchaseDataType = {
  amount: number;
  order_id: string;
  callback: string;
  desc?: string;
  name?: string;
  phone?: string;
  mail?: string;
};

export type PurchaseResponseType = {
  id: string;
  link: string;
};

export type VerifyDataType = {
  id: string;
  order_id: string;
};

export type VerifyResponseType = {
  status: number;
  track_id: number;
  id: string;
  order_id: string;
  amount: number;
  date: Date;
  payment: {
    track_id: string;
    amount: number;
    card_no: string;
    hashed_card_no: string;
    date: Date;
  };
  verify: {
    date: Date;
  };
};
