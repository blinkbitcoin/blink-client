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

const boltzMerchantDetails = {
  category: "swap",
  companyName: "Boltz",
  termsUrl: "https://boltz.exchange/terms",
} satisfies Pick<Merchant, "category" | "companyName" | "termsUrl">

const swapCapabilities: SwapCapability[] = [
  {
    asset: "LBTC",
    displayNetwork: "Liquid",
    lightningAddressNetwork: "Liquid",
    networkSlug: "liquid",
    addressFamily: "liquid",
  },
  {
    asset: "RBTC",
    displayNetwork: "Rootstock",
    lightningAddressNetwork: "Rootstock",
    networkSlug: "rootstock",
    addressFamily: "evm",
  },
  {
    asset: "tBTC",
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
    addressFamily: "evm",
  },
  {
    asset: "WBTC",
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
    addressFamily: "evm",
  },
  {
    asset: "USDT",
    displayNetwork: "Tron",
    lightningAddressNetwork: "Tron",
    networkSlug: "tron",
    addressFamily: "tron",
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
    displayNetwork: "Solana",
    lightningAddressNetwork: "Solana",
    networkSlug: "solana",
    addressFamily: "solana",
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
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
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
    asset: "USDC",
    displayNetwork: "Ethereum",
    lightningAddressNetwork: "Ethereum",
    networkSlug: "ethereum",
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
    asset: "USDC",
    displayNetwork: "Base",
    lightningAddressNetwork: "Base",
    networkSlug: "base",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Arbitrum",
    lightningAddressNetwork: "Arbitrum",
    networkSlug: "arbitrum",
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
    displayNetwork: "Avalanche C-Chain",
    lightningAddressNetwork: "Avalanche C-Chain",
    networkSlug: "avalanche-c-chain",
    addressFamily: "evm",
  },
  {
    asset: "USDC",
    displayNetwork: "Monad",
    lightningAddressNetwork: "Monad",
    networkSlug: "monad",
    addressFamily: "evm",
  },
]

export const boltzSwapDomains = {
  mainnet: "swap.blink.sv",
  signet: "swap.staging.blink.sv",
  regtest: "swap.staging.blink.sv",
} satisfies { [K in Network]: string }

export const getBoltzSwapIdentifier = (input: string): string | null => {
  return getSwapAddressFamily(input) ? input : null
}

export const getBoltzSwapMerchants = (
  recipient: string,
  network: Network,
): Merchant[] => {
  const addressFamily = getSwapAddressFamily(recipient)
  if (!addressFamily) {
    return []
  }

  const domain = boltzSwapDomains[network]
  return swapCapabilities
    .filter((capability) => capability.addressFamily === addressFamily)
    .map(({ asset, displayNetwork, lightningAddressNetwork, networkSlug }) => ({
      id: `blink-boltz-${asset.toLowerCase()}-${networkSlug}`,
      lnurl: `${recipient}+${asset}+${lightningAddressNetwork}@${domain}`,
      ...boltzMerchantDetails,
      title: `${asset} ${displayNetwork}`,
      description: `Swap sats to ${asset} on ${displayNetwork}`,
    }))
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
