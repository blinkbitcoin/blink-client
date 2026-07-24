import { boltzSwapMerchant } from "./boltz-swap-merchants"
import { normalizeMerchantInput } from "./helpers"
import { moneyBadgerMerchants } from "./money-badger-merchants"
import type { Merchant, MerchantConfig } from "./types"
import type { Network } from "../types"

export { getIdentifierFromRegex } from "./helpers"
export type { Merchant, MerchantCategory, MerchantConfig } from "./types"

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

  const matchedMerchants: Merchant[] = []
  const normalizedQrContent = normalizeMerchantInput(qrContent)

  for (const merchant of merchants) {
    const identifier = merchant.getIdentifier(normalizedQrContent)
    if (identifier) {
      if (merchant.getMerchants) {
        matchedMerchants.push(...merchant.getMerchants(identifier, network))
      } else {
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
      }
    }
  }

  return matchedMerchants
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
  const matchingMerchants = getMatchingMerchants({ qrContent, network })
  const merchant = getCurrencyMatchedMerchant({
    merchants: matchingMerchants,
    displayCurrency,
  })

  return merchant?.lnurl ?? null
}
