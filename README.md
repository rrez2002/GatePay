# Typescript Payment Gateway


> This package works with multiple drivers, and you can create custom drivers if you can't find them in the [current drivers list](#list-of-available-drivers) (below list).

- [داکیومنت فارسی](https://github.com/rrez2002/GatePay/blob/main/README-FA.md)
- [English documents](https://github.com/rrez2002/GatePay/blob/main/README.md)

# List of contents

- [Typescript Payment Gateway](#typescript-payment-gateway)
- [List of contents](#list-of-contents)
- [List of available drivers](#list-of-available-drivers)
  - [Install](#install)
  - [How to use](#how-to-use)
    - [Working with invoices](#working-with-invoices)
    - [Purchase invoice](#purchase-invoice)
    - [Pay invoice](#pay-invoice)
    - [Verify payment](#verify-payment)
    - [Useful methods](#useful-methods)
    - [Create custom drivers:](#create-custom-drivers)
  - [Local driver (for development)](#local-driver)


  # List of available drivers
- [atipay](https://www.atipay.net/) :heavy_check_mark:
- [idpay](https://idpay.ir/) :heavy_check_mark:
- [payir](https://pay.ir/) :heavy_check_mark:
- [payping](https://www.payping.ir/) :heavy_check_mark:
- [sep (saman electronic payment) Keshavarzi & Saderat](https://www.sep.ir) :heavy_check_mark:
- [zarinpal](https://www.zarinpal.com/) :heavy_check_mark:
- [zibal](https://www.zibal.ir/) :heavy_check_mark:
- [shepa](https://shepa.com/) :heavy_check_mark:
- [local](#local-driver) :heavy_check_mark:
- Others are under way.

> you can create your own custom drivers if it doesn't exist in the list, read the `Create custom drivers` section.

## Install

```bash
$ npm install gatepay
```

## How to use


In your code, use it like the below:

```typescript
  // Create new Instance.
  const payment = new Payment(Driver);

  // Set merchantId.
  payment.setMerchantId("merchantId");
  // Set invoice amount.
  payment.setAmount(10000);
  //Add invoice details.
  payment.getDriver().setDetail("detail", "value");

  //or 

  // Create new invoice.
  const invoice = new Invoice()
  // Set invoice amount.
  invoice.setAmount(10000)
  // Set invoice details.
  invoice.setDetail("detail", "value")
  // Set invoice.
  payment.getDriver().setInvoice(invoice);

```

## Purchase invoice
In order to pay the invoice, we need the payment transactionId. We purchase the invoice to retrieve transaction id:

```typescript
  // Purchase method accepts a callback function.
  payment
    .purchase((amont: number, transactionId: string, uuid: string) => {
      // We can store transactionId in database
    })
```

## Pay invoice

```typescript
  // Retrieve json format of Redirection (in this case you can handle redirection to bank gateway)
  payment
  .purchase((amont: number, transactionId: string, uuid: string) => {
    // Store transactionId in database.
    // We need the transactionId to verify payment in the future.
  })
  .then((res) => {
    return res.pay().toJson();
  });
```

## Verify payment

```typescript
  // You need to verify the payment to ensure the invoice has been paid successfully.
  // We use transaction id to verify payments
  // It is a good practice to add invoice amount as well.
  try {
    const receipt = await payment.setTransactionId(transactionId).verify();

    // You can show payment referenceId to the user.
    receipt.getReferenceId()
    // You can get payment date tame.
    receipt.getDate()
    
  } catch (error) {
    // when payment is not verified, it will throw an exception.

    console.log(error);
  }

```

#####  You can get payment data.
```typescript
  
  try {
    const receipt: DriverReceipt = await payment.setTransactionId(transactionId).verify();
    
    receipt.getData()
    
  } catch (error) {
    // when payment is not verified, it will throw an exception.

    console.log(error);
  }

```

## Create custom drivers:

```typescript

import { Driver, Receipt, DetailInterface, Setting, Gateway, Invoice, Payment } from "gatepay";

interface CustomSetting extends Setting {}

export interface CustomDetail extends DetailInterface {
  custom?: string;
}

type VerifyResponseType = {id: string, order_id: string}

class CustomReceipt extends Receipt<VerifyResponseType> {}

class Custom extends Driver<Invoice<CustomDetail>> {
  public settings: CustomSetting = {
      apiPaymentUrl: "http://api.custom.com/payment",
      apiPurchaseUrl: "http://api.custom.com/purchase",
      apiVerificationUrl: "http://api.custom.com/verify",
      callbackUrl: "http://callback.custom.com",
      merchantId: "",
  };
  constructor() {
    super(new Invoice());
  }

  // Purchase the invoice, save its transactionId and finaly return it.
  async purchase(): Promise<string> {
    // Request for a payment transaction id.
    ...


    this.invoice.setTransactionId("custom");

    return this.invoice.getTransactionId();
  }

  // Redirect into bank using transactionId, to complete the payment.
  pay(): Gateway {
    // Prepare payment url.
    const payUrl = `${this.settings.apiPaymentUrl}${this.invoice.getTransactionId()}`;

    // Redirect to the bank.
    return new Gateway(payUrl, "GET");
  }

  // Verify the payment (we must verify to ensure that user has paid the invoice).
  async verify(): Promise<CustomReceipt> {
    //

    return new CustomReceipt("payment_receipt_number", data);
  }
}

```

## Local driver

`Local` driver can simulate payment flow of a real gateway for development purpose.

Payment can be initiated like any other driver

#####  You can get payment data.

```typescript
  // Create new Instance.
  const payment = new Payment(Local);

  // Set merchantId.
  payment.setMerchantId("merchantId");
  // Set invoice amount.
  payment.setAmount(10000);
  //Add invoice details.
  payment.getDriver().setDetail("detail", "value");

```

Payment can be verified after receiving the callback request.

```typescript
  const receipt: LocalReceipt = await payment.setTransactionId(transactionId).verify();
```

In case of succesful payment, `receipt` will contains the following parameters

```typescript
  {
    orderId: // fake order number 
    traceNo: // fake trace number (this should be stored in databse)
    referenceNo: // generated transaction ID in `purchase` method callback
    cardNo:// fake last four digits of card 
  }
```