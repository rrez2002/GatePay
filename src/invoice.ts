import { v4 as uuidv4 } from "uuid";

interface InvoiceInterface {
  amount: number;
  setUuid(uuid: string | null): Invoice;
  getUuid(): string;
  setTransactionId(token: string): Invoice;
  getTransactionId(): string;
  setAmount(amount: number): Invoice;
  getAmount(): number;
  setDriver(driver: string): Invoice;
  getDriver(): string;
}

export default class Invoice implements InvoiceInterface {
  uuid: string;
  transactionId: string;
  driver: string;
  amount: number = 0;

  constructor() {
    this.setUuid();
  }

  setUuid(uuid: string | null = null) {
    if (!uuid) uuid = uuidv4();

    this.uuid = uuid;

    return this;
  }

  getUuid() {
    return this.uuid;
  }

  setTransactionId(token: string) {
    this.transactionId = token;

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

  setDriver(driver: string) {
    this.driver = driver;
    return this;
  }
  getDriver() {
    return this.driver;
  }
}
