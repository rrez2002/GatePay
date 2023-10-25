import { Driver } from "./abstracts/driver";
import { driverApis } from "./config";
import { Gateway } from "./gateway";

export class Payment<T extends Driver> {
  protected driver: T;

  constructor(driver: { new (): T }) {
    this.setDriver(driver);
  }

  /**
   *
   * @param url
   * @returns Payment
   */
  setCallbackUrl(url: string): Payment<T> {
    this.getDriver().settings.callbackUrl = url;

    return this;
  }

  /**
   *
   * @returns Payment
   */
  resetCallbackUrl(): Payment<T> {
    this.setCallbackUrl(
      driverApis[this.getDriver().getInvoice().getDriverName()].callbackUrl,
    );

    return this;
  }

  /**
   *
   * @param amount
   * @returns Payment
   */
  setAmount(amount: number): Payment<T> {
    this.getDriver().getInvoice().setAmount(amount);

    return this;
  }

  /**
   *
   * @param merchantId
   * @returns Payment
   */
  setMerchantId(merchantId: string): Payment<T> {
    this.getDriver().settings.merchantId = merchantId;

    return this;
  }

  /**
   *
   * @param transactionId
   * @returns Payment
   */
  setTransactionId(transactionId: string): Payment<T> {
    this.getDriver().getInvoice().setTransactionId(transactionId);

    return this;
  }

  /**
   *
   * @param driverName
   * @returns Payment
   */
  setDriver(driver: new () => T): Payment<T> {
    this.driver = new driver();

    return this;
  }

  /**
   *
   * @returns Driver
   */
  getDriver(): T {
    return this.driver;
  }

  /**
   *
   * @returns Payment
   */
  async purchase(
    callback?: (amont: number, transactionId: string, uuid: string) => any,
  ): Promise<Payment<T>> {
    await this.getDriver().purchase();
    await callback(
      this.getDriver().getInvoice().getAmount(),
      this.getDriver().getInvoice().getTransactionId(),
      this.getDriver().getInvoice().getUuid(),
    );
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
