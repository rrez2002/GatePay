import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Detail, Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import {
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./zarinpal.type";
import { driverApis } from "../../config";

export interface ZarinpalDetail extends Detail {
  currency?: "IRT" | "IRR";
}

export class Zarinpal extends Driver {
  private client = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  constructor(
    public invoice: Invoice = new Invoice(),
    public settings: Setting = driverApis["zarinpal"],
    public detail?: ZarinpalDetail,
  ) {
    super(invoice, settings, detail);
    this.invoice.setDriver("zarinpal");
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    try {
      let data: PurchaseDataType = {
        amount: this.invoice.getAmount(),
        merchant_id: this.settings.merchantId,
        callback_url: this.settings.callbackUrl,
        description: this.detail.description,
        currency: this.detail.currency,
        metadata: {
          order_id: this.invoice.getUuid(),
          mobile: this.detail.phone,
          email: this.detail.email,
        },
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.code != "100") {
        throw this.translateStatus(response.data.code);
      }

      this.invoice.setTransactionId(response.data.authority);

      return this.invoice.getTransactionId();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.code);
      }
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
        authority: this.invoice.getTransactionId(),
        merchant_id: this.settings.merchantId,
        amount: this.invoice.getAmount(),
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (response.data.code != "100") {
        throw this.translateStatus(response.data.code);
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.status);
      }
      throw error;
    }
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      "100": "تراکنش با موفقیت انجام گردید",
      "101":
        "عمليات پرداخت موفق بوده و قبلا عملیات وریفای تراكنش انجام شده است",
      "-9": "خطای اعتبار سنجی",
      "-10": "ای پی و يا مرچنت كد پذيرنده صحيح نمی باشد",
      "-11": "مرچنت کد فعال نیست لطفا با تیم پشتیبانی ما تماس بگیرید",
      "-12": "تلاش بیش از حد در یک بازه زمانی کوتاه",
      "-15": "ترمینال شما به حالت تعلیق در آمده با تیم پشتیبانی تماس بگیرید",
      "-16": "سطح تاييد پذيرنده پايين تر از سطح نقره ای می باشد",
      "-30": "اجازه دسترسی به تسویه اشتراکی شناور ندارید",
      "-31":
        "حساب بانکی تسویه را به پنل اضافه کنید مقادیر وارد شده برای تسهیم صحيح نمی باشد",
      "-32": "مقادیر وارد شده برای تسهیم صحيح نمی باشد",
      "-33": "درصد های وارد شده صحيح نمی باشد",
      "-34": "مبلغ از کل تراکنش بیشتر است",
      "-35": "تعداد افراد دریافت کننده تسهیم بیش از حد مجاز است",
      "-40": "پارامترهای اضافی نامعتبر، expire_in معتبر نیست",
      "-50": "مبلغ پرداخت شده با مقدار مبلغ در وریفای متفاوت است",
      "-51": "پرداخت ناموفق",
      "-52": "خطای غیر منتظره با پشتیبانی تماس بگیرید",
      "-53": "اتوریتی برای این مرچنت کد نیست",
      "-54": "اتوریتی نامعتبر است",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
