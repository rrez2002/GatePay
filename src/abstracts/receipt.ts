import { ReceiptInterface } from "../contracts/interface/receipt.interface";

export abstract class Receipt<T> implements ReceiptInterface<T> {
  private date: Date;

  constructor(
    private referenceId: string,
    private data: T,
  ) {
    this.date = new Date();
  }
  getReferenceId(): string {
    return this.referenceId;
  }
  getData(): T {
    return this.data;
  }
  getDate(): Date {
    return this.date;
  }
}
