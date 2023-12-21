import { Receipt } from "../../abstracts";
import { VerifyResponseType } from "./atipay.type";

export class AtipayReceipt extends Receipt<VerifyResponseType> {}
