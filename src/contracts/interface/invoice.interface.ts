import Invoice from "../../invoice";
import { DetailInterface } from "./";

export interface InvoiceInterface<D extends DetailInterface> {
  uuid: string;
  transactionId: string;
  amount: number;
  details: Partial<D>
  setUuid(uuid: string): Invoice<D>;
  getUuid(): string;
  setTransactionId(transactionId: string): Invoice<D>;
  getTransactionId(): string;
  setAmount(amount: number): Invoice<any>;
  getAmount(): number;
  setDetail<T extends keyof D>(detail: T, value: D[T]): Invoice<D> 
  getDetail(): Partial<D>
}
