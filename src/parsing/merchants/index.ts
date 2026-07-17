import { boltzSwapMerchant } from "./boltz-swap-merchants"
import { moneyBadgerMerchants } from "./money-badger-merchants"
import type { Network } from "../types"

export { getIdentifierFromRegex } from "./identifier-regex"

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

export type MerchantConfig = Omit<Merchant, "lnurl"> & {
  getIdentifier: (input: string) => string | null
  defaultDomain: string
  domains: { [K in Network]: string }
  getMerchants?: (identifier: string, network: Network) => Merchant[]
}

export const merchants: MerchantConfig[] = [...moneyBadgerMerchants, boltzSwapMerchant]

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
    const identifier = merchant.getIdentifier(qrContent)
    if (!identifier) {
      return matchedMerchants
    }

    if (merchant.getMerchants) {
      matchedMerchants.push(...merchant.getMerchants(identifier, network))
      return matchedMerchants
    }

    const domain = merchant.domains[network] ?? merchant.defaultDomain
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
    return matchingMerchants[0].category === "swap" ? null : matchingMerchants[0]
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
  const matchingMerchants = getMatchingMerchants({ qrContent, network })
  const merchant = getCurrencyMatchedMerchant({
    merchants: matchingMerchants,
    displayCurrency,
  })

  return merchant?.lnurl ?? null
}
