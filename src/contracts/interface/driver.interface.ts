import Invoice from "../../invoice";
import { Driver } from "../../abstracts";
import { Setting } from "./";

export interface DriverInterface {
  invoice: Invoice<any>;
  settings: Setting;

  setInvoice(invoice: Invoice<any>): Driver<any>;
  getInvoice(): Invoice<any>;

  purchase(): Promise<string>;
  pay(): Promise<object>;
  verify(): Promise<string>;
}
