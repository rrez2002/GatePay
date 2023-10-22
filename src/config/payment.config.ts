import { driverType } from "../contracts/type";
import { Setting } from "../contracts/interface";
import { PayIR, Zibal, Zarinpal, Idpay } from "../drivers";

const defaultDriver: driverType = "payir";

const drivers = {
  payir: PayIR,
  zibal: Zibal,
  zarinpal: Zarinpal,
  idpay: Idpay,
};

const driverApis: Record<string, Setting> = {
  payir: {
    apiPaymentUrl: "https://pay.ir/pg/",
    apiPurchaseUrl: "https://pay.ir/pg/send",
    apiVerificationUrl: "https://pay.ir/pg/verify",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "test",
  },
  zibal: {
    apiPaymentUrl: "https://gateway.zibal.ir/start/",
    apiPurchaseUrl: "https://gateway.zibal.ir/v1/request",
    apiVerificationUrl: "https://gateway.zibal.ir/v1/verify",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "zibal",
  },
  zarinpal: {
    apiPaymentUrl: "https://www.zarinpal.com/pg/StartPay/",
    apiPurchaseUrl: "https://api.zarinpal.com/pg/v4/payment/request.json",
    apiVerificationUrl: "https://api.zarinpal.com/pg/v4/payment/verify.json",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "",
  },
  idpay: {
    apiPaymentUrl: "https://api.idpay.ir/v1.1/payment/",
    apiPurchaseUrl: "https://api.idpay.ir/v1.1/payment",
    apiVerificationUrl: "https://api.idpay.ir/v1.1/payment/verify",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "7c9c2457-2798-4d42-b2e2-d8db9ff5b298",
  },
};

export { drivers, defaultDriver, driverApis };
