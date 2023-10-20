import { Gateway } from "../gateway";
import { Setting } from "../contracts/interface";
import Invoice from "../invoice";

export abstract class Driver {
  constructor(
    public invoice: Invoice,
    public settings: Setting,
  ) {}

  public setInvoice(invoice: Invoice): Driver {
    this.invoice = invoice;

    return this;
  }

  public getInvoice() {
    return this.invoice;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Gateway;
  abstract verify(): Promise<any>;
}
