import Invoice from "../../invoice";
import { Driver } from "../../abstracts/driver";
import axios from "axios";
import { Setting } from "../../contracts/interface";
import { v4 as uuidv4 } from "uuid";
import { Gateway } from "../../gateway";

type VerifyResponseType = {
  status: number;
  amount: string;
  transId: string;
  factorNumber: string;
  mobile: string;
  description: string;
  cardNumber: string;
  message: string;
};

export class PayIR extends Driver {
  constructor(
    protected invoice: Invoice,
    protected settings: Setting,
    private client = axios.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
  ) {
    super(invoice, settings);
  }

  /**
   *
   */
  async purchase(): Promise<string> {
    try {
      let factorNumber = uuidv4();

      let data = {
        amount: this.invoice.getAmount(),
        api: this.settings.merchantId,
        redirect: this.settings.callbackUrl,
        description: this.settings.description,
        factorNumber: factorNumber,
        mobile: this.settings.phone,
      };

      const response: any = await this.client.post(
        this.settings.apiPurchaseUrl,
        data,
      );

      this.invoice.setTransactionId(response.data.token);

      return this.invoice.getTransactionId();
    } catch (error: any) {
      throw this.translateStatus(error.response.data.errorCode);
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
      let data = {
        token: this.invoice.getTransactionId(),
        api: this.settings.merchantId,
      };

      const response = await this.client.post(
        this.settings.apiVerificationUrl,
        data,
      );

      if (
        response.data.status != 1 ||
        response.data.amount != this.invoice.getAmount()
      ) {
        throw Error("err");
      }

      return response.data;
    } catch (error: any) {
      throw this.translateStatus(error.response.data.errorCode);
    }
  }

  private translateStatus(status: string) {
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
