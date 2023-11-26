import Invoice from "../../invoice";
import { Driver } from "../../abstracts";
import { AxiosError, AxiosResponse } from "axios";
import { Gateway } from "../../gateway";
import {
  IdpaySetting,
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./idpay.type";
import { DetailInterface } from "../../contracts/interface";
import { IdpayReceipt } from "./idpay.receipt";

export class Idpay extends Driver<Invoice<DetailInterface>> {
  public settings: IdpaySetting = {
    apiPaymentUrl: "https://idpay.ir/p/ws/",
    apiPurchaseUrl: "https://api.idpay.ir/v1.1/payment",
    apiVerificationUrl: "https://api.idpay.ir/v1.1/payment/verify",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "7c9c2457-2798-4d42-b2e2-d8db9ff5b298",
    sandbox: false,
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
        callback: this.settings.callbackUrl,
        desc: this.getInvoice().getDetail().description,
        order_id: this.getInvoice().getUuid(),
        name: this.getInvoice().getDetail().name,
        phone: this.getInvoice().getDetail().phone,
        mail: this.getInvoice().getDetail().email,
      };

      const headers = {
        "X-API-KEY": this.settings.merchantId,
        "X-SANDBOX": this.settings.sandbox,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data, {
          headers,
        });

      this.invoice.setTransactionId(response.data.id);

      return this.invoice.getTransactionId();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.error_code);
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
  async verify(): Promise<IdpayReceipt> {
    try {
      const headers = {
        "X-API-KEY": this.settings.merchantId,
        "X-SANDBOX": this.settings.sandbox,
      };

      let data: VerifyDataType = {
        id: this.getInvoice().getTransactionId(),
        order_id: this.getInvoice().getUuid(),
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data, {
          headers,
        });

      return new IdpayReceipt(response.data.track_id.toString(), response.data);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.error_code);
      }
      throw error;
    }
  }

  private translateStatus(status: string) {
    const translations: Record<string, string> = {
      "1": "پرداخت انجام نشده است.",
      "2": "پرداخت ناموفق بوده است.",
      "3": "خطا رخ داده است.",
      "4": "بلوکه شده.",
      "5": "برگشت به پرداخت کننده.",
      "6": "برگشت خورده سیستمی.",
      "7": "انصراف از پرداخت.",
      "8": "به درگاه پرداخت منتقل شد.",
      "10": "در انتظار تایید پرداخت.",
      "11": "کاربر مسدود شده است.",
      "12": "API Key یافت نشد.",
      "13": "درخواست شما از {ip} ارسال شده است. این IP با IP های ثبت شده در وب سرویس همخوانی ندارد.",
      "14": "وب سرویس تایید نشده است.",
      "21": "حساب بانکی متصل به وب سرویس تایید نشده است.",
      "31": "کد تراکنش id نباید خالی باشد.",
      "32": "شماره سفارش order_id نباید خالی باشد.",
      "33": "مبلغ amount نباید خالی باشد.",
      "34": "مبلغ amount باید بیشتر از {min-amount} ریال باشد.",
      "35": "مبلغ amount باید کمتر از {max-amount} ریال باشد.",
      "36": "مبلغ amount بیشتر از حد مجاز است.",
      "37": "آدرس بازگشت callback نباید خالی باشد.",
      "38": "درخواست شما از آدرس {domain} ارسال شده است. دامنه آدرس بازگشت callback با آدرس ثبت شده در وب سرویس همخوانی ندارد.",
      "51": "تراکنش ایجاد نشد.",
      "52": "استعلام نتیجه ای نداشت.",
      "53": "تایید پرداخت امکان پذیر نیست.",
      "54": "مدت زمان تایید پرداخت سپری شده است.",
      "100": "پرداخت تایید شده است.",
      "101": "پرداخت قبلا تایید شده است.",
      "200": "به دریافت کننده واریز شد.",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
