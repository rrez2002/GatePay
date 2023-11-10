import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import { AxiosResponse } from "axios";
import { DetailInterface, Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import {
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./zibal.type";

export class Zibal extends Driver<Invoice<DetailInterface>> {
  public settings: Setting = {
    apiPaymentUrl: "https://gateway.zibal.ir/start/",
    apiPurchaseUrl: "https://gateway.zibal.ir/v1/request",
    apiVerificationUrl: "https://gateway.zibal.ir/v1/verify",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "zibal",
  };
  constructor() {
    super(new Invoice());
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    try {
      let data: PurchaseDataType = {
        amount: this.getInvoice().getAmount(),
        merchant: this.settings.merchantId,
        callbackUrl: this.settings.callbackUrl,
        description: this.getInvoice().getDetail().description,
        orderId: this.getInvoice().getUuid(),
        mobile: this.getInvoice().getDetail().phone,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.result != "100") {
        throw this.translateStatus(response.data.result);
      }

      this.invoice.setTransactionId(response.data.trackId);

      return this.invoice.getTransactionId();
    } catch (error: any) {
      throw error;
    }
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
    try {
      let data: VerifyDataType = {
        trackId: this.invoice.getTransactionId(),
        merchant: this.settings.merchantId,
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (
        response.data.result != "100" ||
        response.data.amount != this.invoice.getAmount()
      ) {
        throw this.translateStatus(response.data.result);
      }

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      "100": "با موفقیت تایید شد",
      "102": "merchant یافت نشد",
      "103": "merchant غیرفعال",
      "104": "merchant نامعتبر",
      "105": "amount بایستی بزرگتر از 1,000 ریال باشد",
      "106": "callbackUrl نامعتبر می‌باشد. (شروع با http و یا https)",
      "113": "amount مبلغ تراکنش از سقف میزان تراکنش بیشتر است",
      "201": "قبلا تایید شده",
      "202": "سفارش پرداخت نشده یا ناموفق بوده است",
      "203": "trackId نامعتبر می‌باشد",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
