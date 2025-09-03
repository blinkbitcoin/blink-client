import type { Network } from "./types.ts"

type MerchantConfig = {
  id: string
  identifierRegex: RegExp
  defaultDomain: string
  domains: { [K in Network]: string }
}

export const merchants: MerchantConfig[] = [
  {
    id: "picknpay",
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
    identifierRegex:
      /^\s*(?<identifier>((.*zapper\.com.*)|(.{2}\/.{4}\/.{20})|(.*payat\.io.*)|(.*(paynow\.netcash|paynow\.sagepay)\.co\.za.*)|(SK-\d{1,}-\d{23})|(.*\d+\.zap\.pe(.*\n?)*)|(.*transactionjunction\.co\.za.*)|(CRSTPC-\d+-\d+-\d+-\d+-\d+)))\s*$/iu,
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "scantopay",
    identifierRegex: /(?<identifier>.*(scantopay\.io).*)/iu,
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
  {
    id: "snapscan",
    identifierRegex: /(?<identifier>.*(snapscan).*)/iu,
    defaultDomain: "cryptoqr.net",
    domains: {
      mainnet: "cryptoqr.net",
      signet: "staging.cryptoqr.net",
      regtest: "staging.cryptoqr.net",
    },
  },
]

export const convertMerchantQRToLightningAddress = ({
  qrContent,
  network,
}: {
  qrContent: string
  network: Network
}): string | null => {
  if (!qrContent) {
    return null
  }

  for (const merchant of merchants) {
    const match = qrContent.match(merchant.identifierRegex)
    if (match?.groups?.identifier) {
      const domain = merchant.domains[network] || merchant.defaultDomain
      return `${encodeURIComponent(match.groups.identifier)}@${domain}`
    }
  }

  return null
}
