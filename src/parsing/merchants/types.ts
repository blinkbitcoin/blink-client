import type { Network } from "../types"

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
