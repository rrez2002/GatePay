import { Setting } from "../contracts/interface";
import { PayIR, Zibal } from "../drivers";

const defaultDriver: string = "payir";

const drivers = {
  payir: PayIR,
  zibal: Zibal,
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
};

export { drivers, defaultDriver, driverApis };
