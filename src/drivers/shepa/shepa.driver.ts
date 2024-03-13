import { Driver, Receipt } from "../../abstracts";
import Invoice from "../../invoice";
import { Setting } from "../../contracts/interface";
import { Gateway } from "../../gateway";
import { PurchaseDataType, PurchaseResponseType, ShepaDetail, VerifyDataType, VerifyResponseType} from "./shepa.type";
import { AxiosError, AxiosResponse } from "axios";
import { ShepaReceipt } from "./shepa.receipt";

export class Shepa extends Driver<Invoice<ShepaDetail>> {
  constructor(
    public settings: Setting = {
      apiPaymentUrl: "https://merchant.shepa.com/v1/",
      apiPurchaseUrl: "https://merchant.shepa.com/api/v1/token",
      apiVerificationUrl: "https://merchant.shepa.com/api/v1/verify",
      callbackUrl: "http://yoursite.com/path/to",
      merchantId: "sandbox",
    },
  ) {
    super(new Invoice());
  }

  async purchase(): Promise<string> {
    try {

      let data: PurchaseDataType = {
        api: this.settings.merchantId,
        amount: this.getInvoice().getAmount(),
        callback: this.settings.callbackUrl,
        mobile: this.getInvoice().getDetail().mobile,
        cardnumber: this.getInvoice().getDetail().cardnumber,
        email: this.getInvoice().getDetail().email,
        description: this.getInvoice().getDetail().description,
      };

      const response: AxiosResponse<PurchaseResponseType, PurchaseDataType> =
        await this.client.post(this.settings.apiPurchaseUrl, data);

      if (response.data.errors) {
        throw response.data.errors;
      }

      this.getInvoice().setTransactionId(response.data.result.token);

      return this.getInvoice().getTransactionId();
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response.data.errors;
      }
      throw error;
    }
  }

  pay(): Gateway {
    const payUrl = `${this.settings.apiPaymentUrl}${this.invoice.getTransactionId()}`;

    return new Gateway(payUrl, "GET");
  }
  async verify(): Promise<Receipt<any>> {
    try {
      let data: VerifyDataType = {
        token: this.getInvoice().getTransactionId(),
        api: this.settings.merchantId,
        amount: this.getInvoice().getAmount()
      };

      const response: AxiosResponse<VerifyResponseType, VerifyDataType> =
        await this.client.post(this.settings.apiVerificationUrl, data);

      if (!response.data.errors) {
        throw response.data.errors;
      }

      return new ShepaReceipt(
        response.data.result.refid.toString(),
        response.data,
      );
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw error.response.data.ResultDescription;
      }
      throw error;
    }
  }
}