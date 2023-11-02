import { Gateway } from "../gateway";
import { Detail, Setting } from "../contracts/interface";
import Invoice from "../invoice";
import axios from "axios";

export abstract class Driver {
  protected invoice: Invoice;
  public settings: Setting;
  public detail: Detail;
  constructor() {}

  protected client = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  public setInvoice(invoice: Invoice): Driver {
    this.invoice = invoice;

    return this;
  }

  public getInvoice() {
    return this.invoice;
  }

  abstract setDetail<T extends keyof Detail>(
    detail: T,
    value: Detail[T],
  ): Driver;

  getDetail(): Detail {
    return this.detail;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Gateway;
  abstract verify(): Promise<any>;
}
