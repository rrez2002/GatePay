import Invoice from "../../invoice";
import { Driver } from "../../abstracts";
import { AxiosError, AxiosResponse } from "axios";
import { Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import {
  SepDetail,
  PurchaseDataType,
  PurchaseResponseType,
  VerifyDataType,
  VerifyResponseType,
} from "./sep.type";
import { SepReceipt } from "./sep.receipt";

export class Sep extends Driver<Invoice<SepDetail>> {
  constructor(
    public settings: Setting = {
      apiPaymentUrl: "https://sep.shaparak.ir/onlinepg/onlinepg",
      apiPurchaseUrl: "https://sep.shaparak.ir/onlinepg/onlinepg",
      apiVerificationUrl:
        "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction",
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
        action: "token",
        Amount: this.getInvoice().getAmount(),
        TerminalId: this.settings.merchantId,
        RedirectUrl: this.settings.callbackUrl,
        ResNum: this.getInvoice().getUuid(),
        CellNumber: this.getInvoice().getDetail().CellNumber,
        ResNum1: this.getInvoice().getDetail().ResNum1,
        ResNum2: this.getInvoice().getDetail().ResNum2,
        ResNum3: this.getInvoice().getDetail().ResNum3,
        ResNum4: this.getInvoice().getDetail().ResNum4,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.status != "1") {
        throw this.translateStatus(response.data.errorCode);
      }

      this.getInvoice().setTransactionId(response.data.token);

      return this.getInvoice().getTransactionId();
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.translateStatus(error.response.data.errorCode);
      }
      throw error;
    }
  }

  /**
   *
   */
  pay(getMethod: "true" | "false" | "" = "false"): Gateway {
    return new Gateway(this.settings.apiPaymentUrl, "POST", [
      {
        key: "Token",
        value: this.getInvoice().getTransactionId(),
      },
      {
        key: "GetMethod",
        value: getMethod,
      },
    ]);
  }

  /**
   *
   */
  async verify(): Promise<SepReceipt> {
    try {
      let data: VerifyDataType = {
        RefNum: this.getInvoice().getTransactionId(),
        TerminalNumber: this.settings.merchantId,
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (response.data.ResultCode != 0) {
        throw response.data.ResultDescription;
      }

      return new SepReceipt(
        response.data.TransactionDetail.RefNum,
        response.data,
      );
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw error.response.data.ResultDescription;
      }
      throw error;
    }
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      "1": " تراکنش توسط خریدار لغو شده است.",
      "2": "پرداخت با موفقیت انجام شد.",
      "3": "پرداخت انجام نشد.",
      "4": "کاربر در بازه زمانی تعیین شده پاسخی ارسال نکرده است.",
      "5": "پارامترهای ارسالی نامعتبر است.",
      "8": "آدرس سرور پذیرنده نامعتبر است.",
      "9": "رمز کارت 3 مرتبه اشتباه وارد شده است در نتیجه کارت غیر فعال خواهد شد.",
      "10": "توکن ارسال شده یافت نشد.",
      "11": "با این شماره ترمینال فقط تراکنش های توکنی قابل پرداخت هستند.",
      "12": "شماره ترمینال ارسال شده یافت نشد.",
    };

    const unknownError =
      "خطای ناشناخته رخ داده است. در صورت کسر مبلغ از حساب حداکثر پس از 72 ساعت به حسابتان برمیگردد";

    return translations[status] ?? unknownError;
  }
}
