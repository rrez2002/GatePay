import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import { Setting } from "./";

export interface DriverInterface {
  invoice: Invoice;
  settings: Setting;

  setInvoice(invoice: Invoice): Driver;
  getInvoice(): Invoice;

  purchase(): Promise<string>;
  pay(): Promise<object>;
  verify(): Promise<string>;
}
