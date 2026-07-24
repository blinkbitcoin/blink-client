import { normalizeMerchantInput } from "./helpers"
import { getSwapAddressFamily, type SwapAddressFamily } from "./swap-recipient-validators"
import type { Merchant, MerchantConfig } from "./types"
import type { Network } from "../types"

type SwapCapability = {
  asset: string
  displayNetwork: string
  lightningAddressNetwork: string
  networkSlug: string
  addressFamily: SwapAddressFamily
}

type BoltzSwapInput = {
  recipient: string
  capabilities: SwapCapability[]
  normalizedInput: string
}

const boltzMerchantDetails = {
  category: "swap",
  companyName: "Boltz",
  termsUrl: "https://boltz.exchange/terms",
} satisfies Pick<Merchant, "category" | "companyName" | "termsUrl">

const swapCapabilities: SwapCapability[] = [
  {
    asset: "USDC",
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Avalanche C-Chain",
    lightningAddressNetwork: "AvalancheCChain",
    networkSlug: "avalanche-c-chain",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Base",
    lightningAddressNetwork: "Base",
    networkSlug: "base",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Ethereum",
    lightningAddressNetwork: "Ethereum",
    networkSlug: "ethereum",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Monad",
    lightningAddressNetwork: "Monad",
    networkSlug: "monad",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Polygon PoS",
    lightningAddressNetwork: "PolygonPoS",
    networkSlug: "polygon-pos",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Solana",
    lightningAddressNetwork: "Solana",
    networkSlug: "solana",
    addressFamily: "solana",
  },
  {
    asset: "USDT",
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
    addressFamily: "evm",
  },
  {
    asset: "USDT",
    displayNetwork: "Ethereum",
    lightningAddressNetwork: "Ethereum",
    networkSlug: "ethereum",
    addressFamily: "evm",
  },
  {
    asset: "USDT",
    displayNetwork: "Plasma",
    lightningAddressNetwork: "Plasma",
    networkSlug: "plasma",
    addressFamily: "evm",
  },
  {
    asset: "USDT",
    displayNetwork: "Polygon PoS",
    lightningAddressNetwork: "PolygonPoS",
    networkSlug: "polygon-pos",
    addressFamily: "evm",
  },
  {
    asset: "USDT",
    displayNetwork: "Solana",
    lightningAddressNetwork: "Solana",
    networkSlug: "solana",
    addressFamily: "solana",
  },
  {
    asset: "USDT",
    displayNetwork: "Tron",
    lightningAddressNetwork: "Tron",
    networkSlug: "tron",
    addressFamily: "tron",
  },
]

export const boltzSwapDomains = {
  mainnet: "swap.blink.sv",
  signet: "swap.staging.blink.sv",
  regtest: "swap.staging.blink.sv",
} satisfies { [K in Network]: string }

const normalizeSwapFilter = (value: string): string => value.trim().toUpperCase()

const capabilityMatchesFilters = ({
  capability,
  normalizedAsset,
  normalizedNetwork,
}: {
  capability: SwapCapability
  normalizedAsset?: string
  normalizedNetwork?: string
}): boolean => {
  if (normalizedAsset && normalizeSwapFilter(capability.asset) !== normalizedAsset) {
    return false
  }

  if (!normalizedNetwork) {
    return true
  }

  return [
    capability.lightningAddressNetwork,
    capability.displayNetwork,
    capability.networkSlug,
  ]
    .map(normalizeSwapFilter)
    .includes(normalizedNetwork)
}

const parseBoltzSwapInput = (input: string): BoltzSwapInput | null => {
  const normalizedInput = normalizeMerchantInput(input)
  const segments = normalizedInput.split("+")
  if (segments.length > 3) {
    return null
  }

  const [recipient, asset, lightningAddressNetwork] = segments
  if (!recipient) {
    return null
  }

  if (asset === "" || lightningAddressNetwork === "") {
    return null
  }

  if (lightningAddressNetwork && !asset) {
    return null
  }

  const addressFamily = getSwapAddressFamily(recipient)
  if (!addressFamily) {
    return null
  }

  const normalizedAsset = asset ? normalizeSwapFilter(asset) : undefined
  const normalizedNetwork = lightningAddressNetwork
    ? normalizeSwapFilter(lightningAddressNetwork)
    : undefined
  const capabilities = swapCapabilities.filter(
    (capability) =>
      capability.addressFamily === addressFamily &&
      capabilityMatchesFilters({ capability, normalizedAsset, normalizedNetwork }),
  )
  if (capabilities.length === 0) {
    return null
  }

  return {
    recipient,
    capabilities,
    normalizedInput,
  }
}

export const getBoltzSwapIdentifier = (input: string): string | null => {
  return parseBoltzSwapInput(input)?.normalizedInput ?? null
}

export const getBoltzSwapMerchants = (input: string, network: Network): Merchant[] => {
  const parsedInput = parseBoltzSwapInput(input)
  if (!parsedInput) {
    return []
  }

  const domain = boltzSwapDomains[network]
  return parsedInput.capabilities.map(
    ({ asset, displayNetwork, lightningAddressNetwork, networkSlug }) => ({
      id: `blink-boltz-${asset.toLowerCase()}-${networkSlug}`,
      lnurl: `${parsedInput.recipient}+${asset}+${lightningAddressNetwork}@${domain}`,
      ...boltzMerchantDetails,
      title: `${asset} ${displayNetwork}`,
      description: `Swap sats to ${asset} on ${displayNetwork}`,
    }),
  )
}

export const boltzSwapMerchant: MerchantConfig = {
  id: "blink-boltz-swap",
  ...boltzMerchantDetails,
  title: "Boltz Swap",
  description: "Swap sats with Boltz",
  getIdentifier: getBoltzSwapIdentifier,
  defaultDomain: boltzSwapDomains.mainnet,
  domains: boltzSwapDomains,
  getMerchants: getBoltzSwapMerchants,
}
