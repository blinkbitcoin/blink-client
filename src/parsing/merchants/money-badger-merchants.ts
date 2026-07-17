import { getIdentifierFromRegex } from "./identifier-regex"
import type { Merchant, MerchantConfig } from "."

const moneyBadgerTermsUrl = "https://www.moneybadger.co.za/deals/terms-and-conditions"
const moneyBadgerMerchant = {
  category: "merchant-payment",
  description: "Money Badger merchant",
  companyName: "Money Badger",
  termsUrl: moneyBadgerTermsUrl,
} satisfies Pick<Merchant, "category" | "description" | "companyName" | "termsUrl">

export const moneyBadgerMerchants: MerchantConfig[] = [
  {
    id: "picknpay",
    title: "Pick n Pay",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*za\.co\.electrum\.picknpay.*)/iu,
    ),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "ecentric",
    title: "Ecentric",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*za\.co\.ecentric.*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "yoyo",
    title: "Yoyo",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*(wigroup\.co|yoyogroup\.co).*)/iu,
    ),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "zapper",
    title: "Zapper",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*(zapper\.com|\d+\.zap\.pe).*)/iu,
    ),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "payat",
    title: "Payat",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*payat\.io.*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "paynow-netcash",
    title: "Paynow Netcash",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*paynow\.netcash\.co\.za.*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "paynow-sagepay",
    title: "Paynow Sagepay",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*paynow\.sagepay\.co\.za.*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "standard-bank-scantopay",
    title: "Standard Bank Scantopay",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>SK-\d{1,}-\d{23})/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "transactionjunction",
    title: "Transaction Junction",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(
      /(?<identifier>.*transactionjunction\.co\.za.*)/iu,
    ),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "servest-parking",
    title: "Servest Parking",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>CRSTPC-\d+-\d+-\d+-\d+-\d+)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "payat-generic",
    title: "Payat",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.{2}\/.{4}\/.{20})/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "scantopay-url",
    title: "Scantopay Url",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*(scantopay\.io).*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "scantopay-10-digits",
    title: "Scantopay 10 Digits",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/^(?<identifier>\d{10})$/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "snapscan",
    title: "Snapscan",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    getIdentifier: getIdentifierFromRegex(/(?<identifier>.*(snapscan).*)/iu),
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
]
