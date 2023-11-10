import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import { Setting } from "../../contracts/interface";
import { generateFakeCardNumber } from "../../contracts/utility";
import { Gateway } from "../../gateway";
import { LocalDetail, VerifyDataType, VerifyResponseType } from "./local.type";
import { v4 as uuidv4 } from "uuid";

export class Local extends Driver<Invoice<LocalDetail>> {
  public settings: Setting = {
    apiPaymentUrl: "",
    apiPurchaseUrl: "",
    apiVerificationUrl: "",
    callbackUrl: "http://localhost:8080/callback",
    merchantId: "local",
  };
  constructor() {
    super(new Invoice());
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    if (this.getInvoice().getDetail().failedPurchase) {
      throw "failedPurchase";
    }

    this.getInvoice().setTransactionId(uuidv4());

    return this.getInvoice().getTransactionId();
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
      transactionId: this.getInvoice().getTransactionId(),
      cancel: this.getInvoice().getDetail().cancel,
    };

    if (data.cancel) {
      throw this.translateStatus("0");
    }

    return {
      orderId: this.getInvoice().getUuid(),
      traceNo: uuidv4(),
      referenceNo: this.getInvoice().getTransactionId(),
      cardNo: generateFakeCardNumber(),
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
