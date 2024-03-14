<div dir=rtl>

# پکیج درگاه پرداخت برای جاوااسکریپت/تایپ اسکریپت

این پکیج برای پرداخت آنلاین توسط درگاه‌های مختلف در تایپ اسکریپت ایجاد شده است.


> این پکیج با درگاه‌های پرداخت مختلفی کار میکنه. در صورتی که درگاه مورد نظرتون رو در لیست درایورهای موجود پیدا نکردید می‌تونید برای درگاهی که استفاده می‌کنید درایور مورد نظرتون رو بسازید.


- [داکیومنت فارسی](https://github.com/rrez2002/GatePay/blob/main/README-FA.md)
- [English documents](https://github.com/rrez2002/GatePay/blob/main/README.md)

# لیست محتوا

- [درایور های موجود](#درایورهای-موجود)
- [نصب](#نصب)
- [طریقه استفاده](#طریقه-استفاده)
    - [کار با صورتحساب ها](#کار-با-صورتحساب-ها)
    - [ثبت درخواست برای پرداخت صورتحساب](#ثبت-درخواست-برای-پرداخت-صورتحساب)
    - [پرداخت صورتحساب](#پرداخت-صورتحساب)
    - [اعتبار سنجی پرداخت](#اعتبار-سنجی-پرداخت)
    - [ایجاد درایور دلخواه](#ایجاد-درایور-دلخواه)
    - [متدهای سودمند](#متدهای-سودمند)
- [درایور آفلاین (برای تست)](#درایور-آفلاین)

# درایورهای موجود

- [آتی‌پی](https://www.atipay.net/) :heavy_check_mark:
- [ایدی پی](https://idpay.ir/) :heavy_check_mark:
- [پی آی ار](https://pay.ir/) :heavy_check_mark:
- [پی پینگ](https://www.payping.ir/) :heavy_check_mark:
- [سپ (درگاه الکترونیک سامان) کشاورزی و صادرات](https://www.sep.ir) :heavy_check_mark:
- [زرین پال](https://www.zarinpal.com/) :heavy_check_mark:
- [زیبال](https://www.zibal.ir/) :heavy_check_mark:
- [شپا](https://shepa.com/) :heavy_check_mark:

- درایورهای دیگر ساخته خواهند شد یا اینکه بسازید و درخواست `merge` بدید.

> در صورتی که درایور مورد نظرتون موجود نیست, می‌تونید برای درگاه پرداخت موردنظرتون درایور بسازید.
</div>

## نصب

```bash
$ npm install gatepay
```

<div dir="rtl">
## طریقه استفاده

در تمامی پرداخت ها اطلاعات پرداخت درون صورتحساب شما نگهداری میشود. برای استفاده از پکیج ابتدا نحوه ی استفاده از کلاس `Invoice` به منظور کار با صورتحساب ها را توضیح میدهیم.

#### کار با صورتحساب ها

قبل از انجام هرکاری نیاز به ایجاد یک صورتحساب دارید. برای ایجاد صورتحساب می‌توانید از کلاس `Invoice` استفاده کنید.

درون کد خودتون به شکل زیر عمل کنید:

</div>


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

<div dir="rtl">

#### ثبت درخواست برای پرداخت صورتحساب
به منظور پرداخت تمامی صورتحساب ها به یک شماره تراکنش بانکی یا `transactionId` نیاز خواهیم داشت.
با ثبت درخواست به منظور پرداخت میتوان شماره تراکنش بانکی را دریافت کرد:

</div>

```typescript
  // Purchase method accepts a callback function.
  payment
    .purchase((amont: number, transactionId: string, uuid: string) => {
      // We can store transactionId in database
    })
```


<div dir="rtl">

#### پرداخت صورتحساب

با استفاده از شماره تراکنش یا `transactionId` میتوانیم کاربر را به صفحه ی پرداخت بانک هدایت کنیم:

</div>

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


#### اعتبار سنجی پرداخت

بعد از پرداخت شدن صورتحساب توسط کاربر, بانک کاربر را به یکی از صفحات سایت ما برمیگردونه و ما با اعتبار سنجی میتونیم متوجه بشیم کاربر پرداخت رو انجام داده یا نه!

</div>


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

#### دریافت اطلاعات پرداخت

</div>

```typescript
  
  try {
    const receipt: DriverReceipt = await payment.setTransactionId(transactionId).verify();
    
    receipt.getData()
    
  } catch (error) {
    // when payment is not verified, it will throw an exception.

    console.log(error);
  }

```