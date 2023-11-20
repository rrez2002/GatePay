import { Receipt } from "../../abstracts/receipt";
import { VerifyResponseType } from "./idpay.type";

export class IdpayReceipt extends Receipt<VerifyResponseType> {}
