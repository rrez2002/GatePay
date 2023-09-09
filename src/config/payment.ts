import { Setting } from "../contracts/interface/setting.interface";
import {PayIR } from "../drivers";

const defaultDriver: string = "payir";

const drivers = {
  payir: PayIR,
};

const driverApis: Record<string, Setting> = {
  payir: {
    apiPaymentUrl: "https://pay.ir/pg/",
    apiPurchaseUrl: "https://pay.ir/pg/send",
    apiVerificationUrl: "https://pay.ir/pg/verify ",
    description: "توضیحات مربوط به تراکنش",
    callbackUrl: "http://yoursite.com/path/to",
    merchantId: "test",
  },
};

export { drivers, defaultDriver, driverApis };
