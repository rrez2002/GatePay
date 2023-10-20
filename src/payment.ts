import { Driver } from "./abstracts/driver";
import { driverApis, drivers } from "./config";
import { Gateway } from "./gateway";

type driverType = keyof typeof drivers;

export class Payment {
  protected driverName: string;
  protected driver: Driver;

  constructor(driver: string) {
    this.setDriver(driver);
  }

  /**
   *
   * @param url
   * @returns Payment
   */
  setCallbackUrl(url: string): Payment {
    this.getDriverInstance().settings.callbackUrl = url;

    return this;
  }

  /**
   *
   * @returns Payment
   */
  resetCallbackUrl(): Payment {
    this.setCallbackUrl(driverApis[this.driverName].callbackUrl);

    return this;
  }

  /**
   *
   * @param amount
   * @returns Payment
   */
  setAmount(amount: number): Payment {
    this.getDriverInstance().invoice.setAmount(amount);

    return this;
  }

  /**
   *
   * @param transactionId
   * @returns Payment
   */
  setTransactionId(transactionId: string): Payment {
    this.getDriverInstance().invoice.setTransactionId(transactionId);

    return this;
  }

  /**
   *
   * @param driverName
   * @returns Payment
   */
  setDriver(driverName: string): Payment {
    this.validateDriver(driverName);
    this.driverName = driverName;
    this.setDriverInstance(driverName);

    return this;
  }

  /**
   *
   * @param driverName
   * @returns Payment
   */
  setDriverInstance(driverName: string): Payment {
    this.driver = new drivers[driverName as driverType]();
    return this;
  }

  /**
   *
   * @returns Driver
   */
  getDriverInstance(): Driver {
    if (this.driver) return this.driver;
    return this.setDriverInstance(this.driverName).driver;
  }

  /**
   *
   * @param driverName
   * @returns boolean
   */
  validateDriver(driverName: string): boolean {
    if (driverName in drivers) {
      return true;
    }
    throw new Error("driver is invalid");
  }

  /**
   *
   * @returns Payment
   */
  async purchase(): Promise<Payment> {
    await this.getDriverInstance().purchase();

    return this;
  }

  /**
   *
   * @returns Gateway
   */
  pay(): Gateway {
    return this.getDriverInstance().pay();
  }

  /**
   *
   */
  verify() {
    return this.getDriverInstance().verify();
  }
}
