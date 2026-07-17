import type { Network } from "./types.ts"

export type MerchantCategory = "merchant-payment" | "swap"

export type Merchant = {
  id: string
  lnurl: string
  category: MerchantCategory
  title: string
  description: string
  companyName: string
  termsUrl: string
  displayCurrency?: string
}

type MerchantConfig = Omit<Merchant, "lnurl"> & {
  identifierRegex: RegExp
  defaultDomain: string
  domains: { [K in Network]: string }
}

const moneyBadgerTermsUrl = "https://www.moneybadger.co.za/deals/terms-and-conditions"
const moneyBadgerMerchant = {
  category: "merchant-payment",
  description: "Money Badger merchant",
  companyName: "Money Badger",
  termsUrl: moneyBadgerTermsUrl,
} satisfies Pick<Merchant, "category" | "description" | "companyName" | "termsUrl">

export const merchants: MerchantConfig[] = [
  {
    id: "picknpay",
    title: "Pick n Pay",
    ...moneyBadgerMerchant,
    displayCurrency: "ZAR",
    identifierRegex: /(?<identifier>.*za\.co\.electrum\.picknpay.*)/iu,
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
    identifierRegex: /(?<identifier>.*za\.co\.ecentric.*)/iu,
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
    identifierRegex: /(?<identifier>.*(wigroup\.co|yoyogroup\.co).*)/iu,
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
    identifierRegex: /(?<identifier>.*(zapper\.com|\d+\.zap\.pe).*)/iu,
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
    identifierRegex: /(?<identifier>.*payat\.io.*)/iu,
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
    identifierRegex: /(?<identifier>.*paynow\.netcash\.co\.za.*)/iu,
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
    identifierRegex: /(?<identifier>.*paynow\.sagepay\.co\.za.*)/iu,
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
    identifierRegex: /(?<identifier>SK-\d{1,}-\d{23})/iu,
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
    identifierRegex: /(?<identifier>.*transactionjunction\.co\.za.*)/iu,
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
    identifierRegex: /(?<identifier>CRSTPC-\d+-\d+-\d+-\d+-\d+)/iu,
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
    identifierRegex: /(?<identifier>.{2}\/.{4}\/.{20})/iu,
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
    identifierRegex: /(?<identifier>.*(scantopay\.io).*)/iu,
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
    identifierRegex: /^(?<identifier>\d{10})$/iu,
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
    identifierRegex: /(?<identifier>.*(snapscan).*)/iu,
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
]

// strict URI encode adhering to RFC 3986
export const strictUriEncode = (uriComponent: string | number | boolean): string => {
  return encodeURIComponent(uriComponent).replace(
    /[!'()*]/g,
    (value) => `%${value.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

export const getMatchingMerchants = ({
  qrContent,
  network,
}: {
  qrContent: string
  network: Network
}): Merchant[] => {
  if (!qrContent) {
    return []
  }

  return merchants.reduce<Merchant[]>((matchedMerchants, merchant) => {
    const match = qrContent.match(merchant.identifierRegex)
    const identifier = match?.groups?.identifier
    if (!identifier) {
      return matchedMerchants
    }

    const domain = merchant.domains[network] || merchant.defaultDomain
    matchedMerchants.push({
      id: merchant.id,
      lnurl: `${strictUriEncode(identifier)}@${domain}`,
      category: merchant.category,
      title: merchant.title,
      description: merchant.description,
      companyName: merchant.companyName,
      termsUrl: merchant.termsUrl,
      displayCurrency: merchant.displayCurrency,
    })
    return matchedMerchants
  }, [])
}

export const getCurrencyMatchedMerchant = ({
  merchants: matchingMerchants,
  displayCurrency,
}: {
  merchants: Merchant[]
  displayCurrency?: string
}): Merchant | null => {
  if (matchingMerchants.length === 1) {
    return matchingMerchants[0]
  }

  const normalizedCurrency = displayCurrency?.trim().toUpperCase()
  if (!normalizedCurrency) {
    return null
  }

  const currencyMatches = matchingMerchants.filter(
    (merchant) => merchant.displayCurrency?.toUpperCase() === normalizedCurrency,
  )

  return currencyMatches.length === 1 ? currencyMatches[0] : null
}

export const convertMerchantQRToLightningAddress = ({
  qrContent,
  network,
  displayCurrency,
}: {
  qrContent: string
  network: Network
  displayCurrency?: string
}): string | null => {
  const merchant = getCurrencyMatchedMerchant({
    merchants: getMatchingMerchants({ qrContent, network }),
    displayCurrency,
  })

  return merchant?.lnurl ?? null
}
