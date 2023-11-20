import { Receipt } from "../../abstracts";
import { VerifyResponseType } from "./idpay.type";

export class IdpayReceipt extends Receipt<VerifyResponseType> {}
