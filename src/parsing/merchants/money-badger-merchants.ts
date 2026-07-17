import { getIdentifierFromRegex } from "./helpers"
import type { Merchant, MerchantConfig } from "."

const moneyBadgerTermsUrl = "https://www.moneybadger.co.za/deals/terms-and-conditions"
const moneyBadgerMerchant = {
  category: "merchant-payment",
  description: "Money Badger merchant",
  companyName: "Money Badger",
  termsUrl: moneyBadgerTermsUrl,
} satisfies Pick<Merchant, "category" | "description" | "companyName" | "termsUrl">

const moneyBadgerDomains = {
  mainnet: "cryptoqr.net",
  signet: "staging.cryptoqr.net",
  regtest: "staging.cryptoqr.net",
} satisfies MerchantConfig["domains"]

const moneyBadgerConfig = {
  ...moneyBadgerMerchant,
  displayCurrency: "ZAR",
  defaultDomain: moneyBadgerDomains.mainnet,
  domains: moneyBadgerDomains,
} satisfies Pick<
  MerchantConfig,
  | "category"
  | "description"
  | "companyName"
  | "termsUrl"
  | "displayCurrency"
  | "defaultDomain"
  | "domains"
>

export const moneyBadgerMerchants: MerchantConfig[] = [
  {
    id: "picknpay",
    title: "Pick n Pay",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*za\.co\.electrum\.picknpay.*)/iu,
    ),
  },
  {
    id: "ecentric",
    title: "Ecentric",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*za\.co\.ecentric.*)/iu),
  },
  {
    id: "yoyo",
    title: "Yoyo",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*(wigroup\.co|yoyogroup\.co).*)/iu,
    ),
  },
  {
    id: "zapper",
    title: "Zapper",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*(zapper\.com|\d+\.zap\.pe).*)/iu,
    ),
  },
  {
    id: "payat",
    title: "Payat",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*payat\.io.*)/iu),
  },
  {
    id: "paynow-netcash",
    title: "Paynow Netcash",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*paynow\.netcash\.co\.za.*)/iu),
  },
  {
    id: "paynow-sagepay",
    title: "Paynow Sagepay",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*paynow\.sagepay\.co\.za.*)/iu),
  },
  {
    id: "standard-bank-scantopay",
    title: "Standard Bank Scantopay",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>SK-\d{1,}-\d{23})/iu),
  },
  {
    id: "transactionjunction",
    title: "Transaction Junction",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*transactionjunction\.co\.za.*)/iu,
    ),
  },
  {
    id: "servest-parking",
    title: "Servest Parking",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>CRSTPC-\d+-\d+-\d+-\d+-\d+)/iu),
  },
  {
    id: "payat-generic",
    title: "Payat",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.{2}\/.{4}\/.{20})/iu),
  },
  {
    id: "scantopay-url",
    title: "Scantopay Url",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*(scantopay\.io).*)/iu),
  },
  {
    id: "scantopay-10-digits",
    title: "Scantopay 10 Digits",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/^(?<identifier>\d{10})$/iu),
  },
  {
    id: "snapscan",
    title: "Snapscan",
    ...moneyBadgerConfig,
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*(snapscan).*)/iu),
  },
]
