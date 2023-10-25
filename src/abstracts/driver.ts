import { Gateway } from "../gateway";
import { Detail, Setting } from "../contracts/interface";
import Invoice from "../invoice";
import axios from "axios";

export abstract class Driver {
  constructor(
    public invoice: Invoice,
    public settings: Setting,
    public detail: Detail,
  ) {}

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

  abstract setDetail(detail: keyof Detail, value: string): Driver;

  public getDetail() {
    return this.invoice;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Gateway;
  abstract verify(): Promise<any>;
}
