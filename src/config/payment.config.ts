import { Setting } from "../contracts/interface";
import { PayIR, Zibal, Zarinpal } from "../drivers";

const defaultDriver: string = "payir";

const drivers = {
  payir: PayIR,
  zibal: Zibal,
  zarinpal: Zarinpal,
};

const driverApis: Record<string, Setting> = {
  payir: {
    apiPaymentUrl: "https://pay.ir/pg/",
    apiPurchaseUrl: "https://pay.ir/pg/send",
    apiVerificationUrl: "https://pay.ir/pg/verify",
    description: "توضیحات مربوط به تراکنش",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "test",
  },
  zibal: {
    apiPaymentUrl: "https://gateway.zibal.ir/start/",
    apiPurchaseUrl: "https://gateway.zibal.ir/v1/request",
    apiVerificationUrl: "https://gateway.zibal.ir/v1/verify",
    description: "توضیحات مربوط به تراکنش",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "zibal",
  },
  zarinpal: {
    apiPaymentUrl: "https://www.zarinpal.com/pg/StartPay/",
    apiPurchaseUrl: "https://api.zarinpal.com/pg/v4/payment/request.json",
    apiVerificationUrl: "https://api.zarinpal.com/pg/v4/payment/verify.json",
    description: "توضیحات مربوط به تراکنش",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "",
  },
};

export { drivers, defaultDriver, driverApis };
