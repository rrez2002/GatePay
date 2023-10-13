export interface GatewayInterface {
  toJson(): ToJsonResponse;
  toHtml(): unknown;
}

export type ToJsonResponse = {
  url: string;
  method: "GET" | "POST";
};
