import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import { Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import { LocalDetail, VerifyDataType, VerifyResponseType } from "./local.type";
import { v4 as uuidv4 } from "uuid";

export class Local extends Driver {
  protected invoice: Invoice = new Invoice();
  public settings: Setting = {
    apiPaymentUrl: "",
    apiPurchaseUrl: "",
    apiVerificationUrl: "",
    callbackUrl: "http://localhost:8080/callback",
    merchantId: "local",
  };
  public detail: LocalDetail = {};
  constructor() {
    super();
  }

  setDetail<T extends keyof LocalDetail>(
    detail: T,
    value: LocalDetail[T],
  ): Local {
    this.detail[detail] = value;

    return this;
  }

  getDetail(): LocalDetail {
    return this.detail;
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    if (this.getDetail().failedPurchase) {
      throw "failedPurchase";
    }

    this.invoice.setTransactionId(uuidv4());

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
  async verify(): Promise<VerifyResponseType> {
    let data: VerifyDataType = {
      transactionId: this.invoice.getTransactionId(),
      cancel: this.detail.cancel,
    };

    if (data.cancel) {
      throw this.translateStatus("0");
    }

    return {
      orderId: this.invoice.getUuid(),
      traceNo: uuidv4(),
      referenceNo: this.invoice.getTransactionId(),
      cardNo: "",
    };
  }

  private translateStatus(status: string) {
    const translations: Record<string, string> = {
      "0": "تراکنش توسط خریدار لغو شده است.",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
