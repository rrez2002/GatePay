export interface GatewayInterface {
  toJson(): ToJsonResponse;
  toHtml(): unknown;
}

export type ToJsonResponse = {
  url: string;
  method: "GET" | "POST";
  inputs: InputType[];
};

export type InputType = { key: string; value: string };
