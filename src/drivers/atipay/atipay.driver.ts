import Invoice from "../../invoice";
import { Driver } from "../../abstracts";
import { AxiosError, AxiosResponse } from "axios";
import { Gateway } from "../../gateway";
import {
  AtipayDetail,
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./atipay.type";
import { AtipayReceipt } from "./atipay.receipt";
import { Setting } from "../../contracts/interface";

export class Atipay extends Driver<Invoice<AtipayDetail>> {
  public settings: Setting = {
    apiPaymentUrl: "https://mipg.atipay.net/v1/redirect-to-gateway",
    apiPurchaseUrl: "https://mipg.atipay.net/v1/get-token",
    apiVerificationUrl: "https://mipg.atipay.net/v1/verify-payment",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "",
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
        apiKey: this.settings.merchantId,
        amount: this.getInvoice().getAmount(),
        redirectUrl: this.settings.callbackUrl,
        description: this.getInvoice().getDetail().description,
        invoiceNumber: this.getInvoice().getUuid(),
        cellNumber: this.getInvoice().getDetail().cellNumber,
        scatteredSettlementItems:
          this.getInvoice().getDetail().scatteredSettlementItems,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.errorCode) {
        throw this.translateStatus(response.data.errorCode);
      }

      this.invoice.setTransactionId(response.data.token);

      return this.invoice.getTransactionId();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.errorCode);
      }
      throw error;
    }
  }

  /**
   *
   */
  pay(): Gateway {
    return new Gateway(this.settings.apiPaymentUrl, "POST", [
      {
        key: "token",
        value: this.invoice.getTransactionId(),
      },
    ]);
  }

  /**
   *
   */
  async verify(
    res?: Omit<VerifyResponseType, "amount">,
  ): Promise<AtipayReceipt> {
    try {
      if (res.status != "2") {
        throw this.translateStatus(res.status);
      }

      let data: VerifyDataType = {
        referenceNumber: this.getInvoice().getTransactionId(),
        apiKey: this.settings.merchantId,
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (!response.data.amount) {
        throw this.translateStatus("0");
      }

      return new AtipayReceipt(this.getInvoice().getTransactionId(), {
        ...res,
        amount: response.data.amount,
      });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.error_code);
      }
      throw error;
    }
  }

  private translateStatus(status: string) {
    const translations: Record<string, string> = {
      "1": "کاربر انصراف داده است",
      "2": "پرداخت با موفقیت انجام شد",
      "3": "پرداخت انجام نشد",
      "4": "کاربر در بازه زمانی تعیین شده پاسخی ارسال نکرده است",
      "5": "پارامترهای ارسالی نامعتبر است",
      "8": "آدرس سرور پذیرنده نامعتبر است",
      "10": "توکن ارسال شده یافت نشد",
      "11": "با این شماره ترمینال فقط تراکنش های توکنی قابل پرداخت هستند",
      "12": "شماره ترمینال ارسال شده یافت نشد",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
