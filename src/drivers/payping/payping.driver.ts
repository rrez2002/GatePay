import { Setting } from "../../contracts/interface";
import { Driver } from "../../abstracts";
import Invoice from "../../invoice";
import {
  PaypingDetail,
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./payping.type";
import { Gateway } from "../../gateway";
import { AxiosError, AxiosResponse } from "axios";
import { PaypingReceipt } from "./payping.receipt";

export class Payping extends Driver<Invoice<PaypingDetail>> {
  public settings: Setting = {
    apiPaymentUrl: "https://api.payping.ir/v2/pay/gotoipg/",
    apiPurchaseUrl: "https://api.payping.ir/v2/pay/",
    apiVerificationUrl: "https://api.payping.ir/v2/pay/verify/",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "",
  };
  constructor() {
    super(new Invoice());
  }

  async purchase(): Promise<string> {
    try {
      let data: PurchaseDataType = {
        amount: this.getInvoice().getAmount(),
        returnUrl: this.settings.callbackUrl,
        description: this.getInvoice().getDetail().description,
        clientRefId: this.getInvoice().getUuid(),
        payerName: this.getInvoice().getDetail().payerName,
        payerIdentity: this.getInvoice().getDetail().payerIdentity,
      };

      const headers = {
        Authorization: `Bearer ${this.settings.merchantId}`,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data, {
          headers,
        });

      this.invoice.setTransactionId(response.data.code);

      return this.invoice.getTransactionId();
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.status.toString());
      }
      throw error;
    }
  }

  pay(): Gateway {
    const payUrl = `${
      this.settings.apiPaymentUrl
    }${this.invoice.getTransactionId()}`;

    return new Gateway(payUrl, "GET");
  }

  async verify(): Promise<PaypingReceipt> {
    try {
      const headers = {
        Authorization: this.settings.merchantId,
      };

      let data: VerifyDataType = {
        refId: this.getInvoice().getTransactionId(),
        amount: this.getInvoice().getAmount(),
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data, {
          headers,
        });

      return new PaypingReceipt(data.refId.toString(), response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.status.toString());
      }
      throw error;
    }
  }

  private translateStatus(status: string) {
    const translations: Record<string, string> = {
      "400": "مشکلی در ارسال درخواست وجود دارد",
      "401": "عدم دسترسی",
      "403": "دسترسی غیر مجاز",
      "404": "آیتم درخواستی مورد نظر موجود نمی باشد",
      "500": "مشکلی در سرور درگاه پرداخت رخ داده است",
      "503": "سرور درگاه پرداخت در حال حاضر قادر به پاسخگویی نمی باشد",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
