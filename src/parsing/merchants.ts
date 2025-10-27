import type { Network } from "./types.ts"

type MerchantConfig = {
  id: string
  identifierRegex: RegExp
  defaultDomain: string
  domains: { [K in Network]: string }
  displayCurrency?: string
}

export const merchants: MerchantConfig[] = [
  {
    id: "picknpay",
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

export const convertMerchantQRToLightningAddress = ({
  qrContent,
  network,
  displayCurrency,
}: {
  qrContent: string
  network: Network
  displayCurrency?: string
}): string | null => {
  if (!qrContent) {
    return null
  }

  const matchedMerchants = merchants.reduce<
    Array<{ lnurl: string; displayCurrency?: string }>
  >((acc, merchant) => {
    const match = qrContent.match(merchant.identifierRegex)
    if (match?.groups?.identifier) {
      const domain = merchant.domains[network] || merchant.defaultDomain
      acc.push({
        lnurl: `${strictUriEncode(match.groups.identifier)}@${domain}`,
        displayCurrency: merchant.displayCurrency,
      })
    }
    return acc
  }, [])

  if (matchedMerchants.length === 0) {
    return null
  }

  if (matchedMerchants.length === 1) {
    return matchedMerchants[0].lnurl
  }

  const normalizedCurrency = displayCurrency?.trim().toUpperCase()
  const currencyMatch = normalizedCurrency
    ? matchedMerchants.find(
        (merchant) => merchant.displayCurrency?.toUpperCase() === normalizedCurrency,
      )
    : undefined

  if (currencyMatch) {
    return currencyMatch.lnurl
  }

  return null
}
