# Blink Client

JavaScript client library for the Blink stack. This is used in front-end applications like the web and mobile wallets.

## Installation

Install the package with:

```bash
pnpm add @blinkbitcoin/blink-client
```

## Usage

### parsePaymentDestination

```js
import { parsePaymentDestination } from "@blinkbitcoin/blink-client"

const { valid, paymentType, amount } = parsePaymentDestination({
  destination: "username or invoice or bitcoin address",
  network: "mainnet", // or signet or regtest
  lnAddressDomains: ["blink.sv"],
})
```

Valid phone number inputs resolve as Lightning Addresses on `pay.blink.sv` for
mainnet and `pay.staging.blink.sv` for signet or regtest. Set
`phoneNumberLnAddressDomain` to override only that phone-number domain:

```js
parsePaymentDestination({
  destination: "+50370123456",
  network: "mainnet",
  lnAddressDomains: ["blink.sv"],
  phoneNumberLnAddressDomain: "phone.example.com",
})
// lnurl: "+50370123456@phone.example.com"
```

When a QR code or non-phone manual input matches one merchant payment integration, the
result remains a valid `PaymentType.Lnurl` and includes `isMerchant: true` plus a
`merchant` object. When the input matches multiple integrations that cannot be uniquely
selected by `displayCurrency`, the result is:

```ts
{
  paymentType: PaymentType.Merchant,
  merchants: Merchant[],
}
```

Each merchant includes its ID, Lightning address, category, display metadata, and an
optional display currency. `category` is metadata only; consumers make all selection,
filtering, regional eligibility, and policy decisions.

`PaymentType.Merchant` requires consumer selection before payment and does not include a
`valid` field. Branch on `paymentType` before relying on `valid` or initiating payment.

## Test

Test with Jest framework:

```bash
pnpm test
```

## Build

Build production (distribution) files in **dist** folder:

```bash
pnpm build
```

## Local development

<details>
<summary>using pnpm</summary>

Run:

```bash
pnpm link --global
```

and in your test project run:

```bash
pnpm link --global @blinkbitcoin/blink-client
```

If you want to remove the link, run:

```bash
# in your test project
pnpm unlink @blinkbitcoin/blink-client

# in blinkbitcoin/client folder
pnpm unlink --global
```

</details>

<details>
<summary>using yalc</summary>

Run:

```bash
# in blinkbitcoin/blink-client folder
yalc publish
```

in your test project run:

```bash
yalc add @blinkbitcoin/blink-client
```

If you want to remove the symlink, run:

```bash
# in your test project
yalc remove @blinkbitcoin/blink-client
```

to update changes, you have to run <code>yalc publish</code> before run:

```bash
# in your test project
yalc update
```

</details>
