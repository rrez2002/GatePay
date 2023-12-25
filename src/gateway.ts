import { join } from "path";
import {
  GatewayInterface,
  InputType,
  ToJsonResponse,
} from "./contracts/interface";
import { readFileSync } from "fs";

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
    let filePath = join(`${__dirname}/assets/redirect_form.asset.html`);

    let inputs = "";
    let file = readFileSync(filePath, "utf8").toString();
    let inputFilePath = join(`${__dirname}/assets/input.asset.html`);
    let inputFile: string;

    file = file
      .replace("{{ACTION}}", this.url)
      .replace("{{METHOD}}", this.method);
    this.inputs.forEach((input: InputType) => {
      inputFile = readFileSync(inputFilePath, "utf8").toString();

      inputFile = inputFile
        .replace("{{NAME}}", input.key)
        .replace("{{VALUE}}", input.value);

      inputs += `${inputFile}\b\t`;
    });

    file = file.replace("{{INPUT}}", inputs);

    return file;
  }
}
