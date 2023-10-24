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
} from "./idpay.type";
import { driverApis } from "../../config";

interface IdpaySetting extends Setting {
  sandbox?: boolean;
}

export class Idpay extends Driver {
  private client = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  constructor(
    public invoice: Invoice = new Invoice(),
    public settings: IdpaySetting = driverApis["idpay"],
    public detail?: Detail,
  ) {
    super(invoice, settings, detail);
    this.invoice.setDriverName("idpay");
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    try {
      let data: PurchaseDataType = {
        amount: this.invoice.getAmount(),
        callback: this.settings.callbackUrl,
        desc: this.detail.description,
        order_id: this.invoice.getUuid(),
        name: this.detail.name,
        phone: this.detail.phone,
        mail: this.detail.email,
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
  async verify(): Promise<VerifyResponseType> {
    try {
      const headers = {
        "X-API-KEY": this.settings.merchantId,
        "X-SANDBOX": this.settings.sandbox,
      };

      let data: VerifyDataType = {
        id: this.invoice.getTransactionId(),
        order_id: this.invoice.getUuid(),
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data, {
          headers,
        });

      return response.data;
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
