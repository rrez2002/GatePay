import Invoice from "../invoice";

export interface Setting {
  merchantId: number;
  apiPaymentUrl: string;
  apiPurchaseUrl: string;
  callbackUrl: string;
  apiVerificationUrl: string;

  phone?: string;
  email?: string;
  description?: string;
  validCardNumber?: string;
}

export abstract class Driver {
  constructor(
    protected invoice: Invoice,
    protected settings: Setting,
  ) {}

  public setInvoice(invoice: Invoice): Driver {
    this.invoice = invoice;

    return this;
  }

  public getInvoice() {
    return this.invoice;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Promise<object>;
  abstract verify(): Promise<string>;
}
