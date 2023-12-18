import {
  GatewayInterface,
  InputType,
  ToJsonResponse,
} from "./contracts/interface";

export class Gateway implements GatewayInterface {
  constructor(
    private url: string,
    private method: "GET" | "POST",
    private inputs: InputType[] = [],
  ) {}

  toJson(): ToJsonResponse {
    return {
      url: this.url,
      method: this.method,
      inputs: this.inputs,
    };
  }
  toHtml() {
    //TODO: generate html page
  }
}
