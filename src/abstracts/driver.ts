import { Gateway } from "../gateway";
import { Setting } from "../contracts/interface";
import Invoice from "../invoice";
import axios from "axios";
import { Receipt } from "./receipt";

export abstract class Driver<T extends Invoice<any>> {
  protected invoice: T;
  public settings: Setting;
  constructor(invoice: T) {
    this.invoice = invoice
  }

  protected client = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  public setInvoice(invoice: T): Driver<T> {
    this.invoice = invoice;

    return this;
  }

  public getInvoice(): T {
    return this.invoice;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Gateway;
  abstract verify(): Promise<Receipt<any>>;
}
