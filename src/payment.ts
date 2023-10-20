import Invoice from "./invoice";
import { Driver } from "./abstracts/driver";
import { driverApis, drivers } from "./config";
import { Gateway } from "./gateway";

type driverType = keyof typeof drivers;

export class Payment {
  public callbackUrl: string;
  public driver: string;
  public driverInstance: Driver;
  public invoice: Invoice;

  constructor(driver: string) {
    this.invoice = new Invoice();
    this.setDriver(driver);
  }

  /**
   *
   * @param url
   * @returns Payment
   */
  setCallbackUrl(url: string) {
    this.callbackUrl = url;

    return this;
  }

  /**
   *
   * @returns Payment
   */
  resetCallbackUrl() {
    this.setCallbackUrl(driverApis[this.driver].callbackUrl);

    return this;
  }

  /**
   *
   * @param amount
   * @returns Payment
   */
  setAmount(amount: number) {
    this.invoice.setAmount(amount);

    return this;
  }

  /**
   *
   * @param id
   * @returns Payment
   */
  setTransactionId(id: string) {
    this.invoice.setTransactionId(id);

    return this;
  }

  /**
   *
   * @param driver
   * @returns Payment
   */
  setDriver(driver: string) {
    this.validateDriver(driver);
    this.driver = driver;
    this.setDriverInstance(driver);

    return this;
  }

  /**
   *
   * @param driver
   * @returns Payment
   */
  setDriverInstance(driver: string) {
    this.driverInstance = new drivers[driver as driverType]();
    return this;
  }

  /**
   *
   * @returns Driver
   */
  getDriverInstance() {
    if (this.driverInstance) return this.driverInstance;
    return this.setDriverInstance(this.driver);
  }

  /**
   *
   * @param driver
   * @returns boolean
   */
  validateDriver(driver: string) {
    if (driver in drivers) {
      return true;
    }
    throw new Error("driver is invalid");
  }

  /**
   *
   * @param invoice
   * @param callbackUrl
   * @returns Payment
   */
  async purchase(invoice?: Invoice, callbackUrl?: string) {
    if (invoice) this.invoice = invoice;
    if (callbackUrl) this.setCallbackUrl(callbackUrl);

    const transactionId = await this.driverInstance.purchase();

    this.invoice.setTransactionId(transactionId);

    return this;
  }

  /**
   *
   * @returns Payment
   */
  pay(): Gateway {
    this.getDriverInstance();

    return this.driverInstance.pay();
  }

  /**
   *
   * @returns Payment
   */
  verify() {
    this.getDriverInstance();

    return this.driverInstance.verify();
  }
}
