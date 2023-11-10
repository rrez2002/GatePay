import { Driver } from "../src/abstracts/driver";
import { DetailInterface, Setting } from "../src/contracts/interface";
import { Gateway } from "../src/gateway";
import Invoice from "../src/invoice";
import { Payment } from "../src/payment";

interface TestSetting extends Setting {
  test?: boolean;
}

export interface TestDetail extends DetailInterface {
  test?: boolean;
}

class Test extends Driver<Invoice<TestDetail>> {
  public settings: TestSetting = {
      apiPaymentUrl: "",
      apiPurchaseUrl: "",
      apiVerificationUrl: "",
      callbackUrl: "",
      merchantId: "",
      test: false,
  };
  constructor() {
    super(new Invoice());
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    this.invoice.setTransactionId("test");

    return this.invoice.getTransactionId();
  }

  /**
   *
   */
  pay(): Gateway {
    const payUrl = `${
      this.settings.apiPaymentUrl
    }${this.invoice.getTransactionId()}`;

    return new Gateway(payUrl, "GET");
  }

  /**
   *
   */
  async verify() {
    let data = {
      id: this.invoice.getTransactionId(),
      order_id: this.invoice.getUuid(),
    };

    return data;
  }
}

describe("payment", () => {
  const payment = new Payment(Test);

  test("shule be amount 10000", () => {
    payment.setAmount(10000);

    expect(payment.getDriver().getInvoice().getAmount()).toBe(10000);
  });

  test("shule be test merchantId", () => {
    payment.setMerchantId("test");

    expect(payment.getDriver().settings.merchantId).toBe("test");
  });

  test("shule be set custom setting", () => {
    payment.getDriver().settings.test = true;

    expect(payment.getDriver().settings.test).toBe(true);
  });

  test("shule be test callbackUrl", () => {
    payment.setCallbackUrl("test");

    expect(payment.getDriver().settings.callbackUrl).toBe("test");
  });

  test("shule be test description", () => {
    payment.getDriver().getInvoice().setDetail("description", "test");

    expect(payment.getDriver().getInvoice().getDetail().description).toBe("test");
  });

  test("shule be set custom detail test ", () => {
    payment.getDriver().getInvoice().setDetail("test", true);

    expect(payment.getDriver().getInvoice().getDetail().test).toBe(true);
  });

  test("shule be test transactionId", () => {
    payment.purchase(() => {});

    expect(payment.getDriver().getInvoice().getTransactionId()).toBe("test");
  });

  test("shule be test uuid", () => {
    payment.getDriver().getInvoice().setUuid("test");

    expect(payment.getDriver().getInvoice().getUuid()).toBe("test");
  });

  test("purchase callback", () => {
    payment.purchase((amont: number, transactionId: string, uuid: string) => {
      expect(payment.getDriver().getInvoice().getTransactionId()).toBe("test");
      expect(payment.getDriver().getInvoice().getTransactionId()).toBe(
        transactionId,
      );
      expect(payment.getDriver().getInvoice().getUuid()).toBe(uuid);
      expect(payment.getDriver().getInvoice().getAmount()).toBe(amont);
    });
  });
});
