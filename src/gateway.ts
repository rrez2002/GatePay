export class Gateway {
  constructor(
    private url: string,
    private method: "GET" | "POST",
  ) {}

  toJson() {
    return {
      url: this.url,
      method: this.method,
    };
  }
  toHtml() {
    //TODO: generate html page
  }
}
