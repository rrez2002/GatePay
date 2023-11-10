import { DetailInterface, InvoiceInterface } from "./contracts/interface";
import { v4 as uuidv4 } from "uuid";

export default class Invoice<D extends DetailInterface> implements InvoiceInterface<D> {
  uuid: string;
  transactionId: string;
  driver: string;
  amount: number = 0;
  details: Partial<D> = {};

  constructor() {
    this.setUuid();
  }

  setUuid(uuid?: string) {
    if (!uuid) uuid = uuidv4();

    this.uuid = uuid;

    return this;
  }

  getUuid() {
    if (!this.uuid) this.setUuid();

    return this.uuid;
  }

  setTransactionId(transactionId: string) {
    this.transactionId = transactionId;

    return this;
  }
  getTransactionId(): string {
    return this.transactionId;
  }
  getAmount(): number {
    return this.amount;
  }
  setAmount(amount: number) {
    this.amount = amount;
    return this;
  }

  setDetail<T extends keyof D>(detail: T, value: D[T]): Invoice<D> {
    this.details[detail] = value;

    return this;
  }

  getDetail(): Partial<D> {
    return this.details;
  }
}
