import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import { AxiosError, AxiosResponse } from "axios";
import { Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import {
  PayIRDetail,
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./payir.type";
import { PayIRReceipt } from "./payir.receipt";

export class PayIR extends Driver<Invoice<PayIRDetail>> {
  constructor(
    public settings: Setting = {
      apiPaymentUrl: "https://pay.ir/pg/",
      apiPurchaseUrl: "https://pay.ir/pg/send",
      apiVerificationUrl: "https://pay.ir/pg/verify",
      callbackUrl: "http://yoursite.com/path/to",
      merchantId: "test",
    },
  ) {
    super(new Invoice());
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    try {
      let data: PurchaseDataType = {
        amount: this.getInvoice().getAmount(),
        api: this.settings.merchantId,
        redirect: this.settings.callbackUrl,
        description: this.getInvoice().getDetail().description,
        factorNumber: this.getInvoice().getUuid(),
        mobile: this.getInvoice().getDetail().phone,
        validCardNumber: this.getInvoice().getDetail().validCardNumber,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.status != "1") {
        throw this.translateStatus(response.data.status);
      }

      this.getInvoice().setTransactionId(response.data.token);

      return this.getInvoice().getTransactionId();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.status);
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
    }${this.getInvoice().getTransactionId()}`;

    return new Gateway(payUrl, "GET");
  }

  /**
   *
   */
  async verify(): Promise<PayIRReceipt> {
    try {
      let data: VerifyDataType = {
        token: this.getInvoice().getTransactionId(),
        api: this.settings.merchantId,
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (
        response.data.status != "1" ||
        response.data.amount != this.getInvoice().getAmount().toString()
      ) {
        throw this.translateStatus(response.data.status);
      }

      return new PayIRReceipt(response.data.transId, response.data);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.status);
      }
      throw error;
    }
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      "0": "درحال حاضر درگاه بانکی قطع شده و مشکل بزودی برطرف می شود",
      "-1": "API Key ارسال نمی شود",
      "-2": "Token ارسال نمی شود",
      "-3": "API Key ارسال شده اشتباه است",
      "-4": "امکان انجام تراکنش برای این پذیرنده وجود ندارد",
      "-5": "تراکنش با خطا مواجه شده است",
      "-6": "تراکنش تکراریست یا قبلا انجام شده",
      "-7": "مقدار Token ارسالی اشتباه است",
      "-8": "شماره تراکنش ارسالی اشتباه است",
      "-9": "زمان مجاز برای انجام تراکنش تمام شده",
      "-10": "مبلغ تراکنش ارسال نمی شود",
      "-11": "مبلغ تراکنش باید به صورت عددی و با کاراکترهای لاتین باشد",
      "-12": "مبلغ تراکنش می بایست عددی بین 10,000 و 500,000,000 ریال باشد",
      "-13": "مقدار آدرس بازگشتی ارسال نمی شود",
      "-14":
        "آدرس بازگشتی ارسالی با آدرس درگاه ثبت شده در شبکه پرداخت پی یکسان نیست",
      "-15": "امکان وریفای وجود ندارد. این تراکنش پرداخت نشده است",
      "-16": "یک یا چند شماره موبایل از اطلاعات پذیرندگان ارسال شده اشتباه است",
      "-17": "میزان سهم ارسالی باید بصورت عددی و بین 1 تا 100 باشد",
      "-18": "فرمت پذیرندگان صحیح نمی باشد",
      "-19": "هر پذیرنده فقط یک سهم میتواند داشته باشد",
      "-20": "مجموع سهم پذیرنده ها باید 100 درصد باشد",
      "-21": "Reseller ID ارسالی اشتباه است",
      "-22": "فرمت یا طول مقادیر ارسالی به درگاه اشتباه است",
      "-23":
        "سوییچ PSP ( درگاه بانک ) قادر به پردازش درخواست نیست. لطفا لحظاتی بعد مجددا تلاش کنید",
      "-24": "شماره کارت باید بصورت 16 رقمی، لاتین و چسبیده بهم باشد",
      "-25": "امکان استفاده از سرویس در کشور مبدا شما وجود نداره",
      "-26": "امکان انجام تراکنش برای این درگاه وجود ندارد",
      "-27": "در انتظار تایید درگاه توسط شاپرک",
      "-28": "امکان تسهیم تراکنش برای این درگاه وجود ندارد",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
