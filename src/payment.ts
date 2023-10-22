import { driverType } from "./contracts/type";
import { Driver } from "./abstracts/driver";
import { defaultDriver, driverApis, drivers } from "./config";
import { Gateway } from "./gateway";

export class Payment {
  protected driverName: driverType;
  protected driver: Driver;

  constructor(driver: driverType = defaultDriver) {
    this.setDriver(driver);
  }

  /**
   *
   * @param url
   * @returns Payment
   */
  setCallbackUrl(url: string): Payment {
    this.getDriver().settings.callbackUrl = url;

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
    this.getDriver().invoice.setAmount(amount);

    return this;
  }

  /**
   *
   * @param transactionId
   * @returns Payment
   */
  setTransactionId(transactionId: string): Payment {
    this.getDriver().invoice.setTransactionId(transactionId);

    return this;
  }

  /**
   *
   * @param driverName
   * @returns Payment
   */
  setDriver(driverName: driverType): Payment {
    this.driverName = driverName;
    this.driver = new drivers[driverName]();

    return this;
  }

  /**
   *
   * @returns Driver
   */
  getDriver(): Driver {
    if (this.driver) return this.driver;
    return this.setDriver(this.driverName).driver;
  }

  /**
   *
   * @returns Payment
   */
  async purchase(): Promise<Payment> {
    await this.getDriver().purchase();

    return this;
  }

  /**
   *
   * @returns Gateway
   */
  pay(): Gateway {
    return this.getDriver().pay();
  }

  /**
   *
   */
  async verify() {
    return this.getDriver().verify();
  }
}
