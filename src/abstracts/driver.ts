import { Gateway } from "../gateway";
import { Detail, Setting } from "../contracts/interface";
import Invoice from "../invoice";

export abstract class Driver {
  constructor(
    public invoice: Invoice,
    public settings: Setting,
    public detail: Detail,
  ) {}

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
