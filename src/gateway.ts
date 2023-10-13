import { GatewayInterface, ToJsonResponse } from "./contracts/interface";

export class Gateway implements GatewayInterface {
  constructor(
    private url: string,
    private method: "GET" | "POST",
  ) {}

  toJson(): ToJsonResponse {
    return {
      url: this.url,
      method: this.method,
    };
  }
  toHtml() {
    //TODO: generate html page
  }
}
