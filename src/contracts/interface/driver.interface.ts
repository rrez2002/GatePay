import Invoice from "../../invoice";
import { Driver, Receipt } from "../../abstracts";
import { Setting } from "./";
import { Gateway } from "../../gateway";

export interface DriverInterface {
  invoice: Invoice<any>;
  settings: Setting;

  setInvoice(invoice: Invoice<any>): Driver<any>;
  getInvoice(): Invoice<any>;

  purchase(): Promise<string>;
  pay(): Gateway;
  verify(): Promise<Receipt<any>>;
}
