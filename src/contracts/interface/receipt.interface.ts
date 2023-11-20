export interface ReceiptInterface<T> {
  getReferenceId(): string;
  getData(): T;
  getDate(): Date;
}
