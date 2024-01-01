import { DetailInterface, InvoiceInterface } from "./contracts/interface";
import { v4 as uuidv4 } from "uuid";
import { CurrencyType } from "./contracts/type";

export default class Invoice<D extends DetailInterface>
  implements InvoiceInterface<D>
{
  uuid: string;
  transactionId: string;
  driver: string;
  amount: number = 0;
  details: Partial<D> = {};
  currency: CurrencyType = "IRR";

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
    return this.currency == "IRR" ? this.amount : this.amount / 10 ;
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
  setCurrency(currency: CurrencyType): Invoice<D> {
    this.currency = currency;

    return this;
  }

  getCurrency(): CurrencyType {
    return this.currency;
  }
}
