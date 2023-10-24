import Invoice from "../../invoice";

export interface InvoiceInterface {
  uuid: string;
  transactionId: string;
  driver: string;
  amount: number;
  setUuid(uuid: string): Invoice;
  getUuid(): string;
  setTransactionId(transactionId: string): Invoice;
  getTransactionId(): string;
  setAmount(amount: number): Invoice;
  getAmount(): number;
  setDriverName(driver: string): Invoice;
  getDriverName(): string;
}
