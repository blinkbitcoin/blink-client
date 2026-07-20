import { base58, createBase58check, hex } from "@scure/base"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 as keccak256 } from "@noble/hashes/sha3"

export type SwapAddressFamily = "evm" | "solana" | "tron"

const validateEvmRecipient = (input: string): string | null => {
  if (!/^0x[0-9a-f]{40}$/iu.test(input)) {
    return null
  }

  const address = input.slice(2)
  if (address === address.toLowerCase() || address === address.toUpperCase()) {
    return input
  }

  const addressHash = hex.encode(keccak256(address.toLowerCase())).toLowerCase()
  const hasValidChecksum = [...address].every((char, index) => {
    const checksumNibble = parseInt(addressHash[index], 16)
    return checksumNibble >= 8 ? char === char.toUpperCase() : char === char.toLowerCase()
  })

  return hasValidChecksum ? input : null
}

const validateSolanaRecipient = (input: string): string | null => {
  try {
    return base58.decode(input).length === 32 ? input : null
  } catch {
    return null
  }
}

const base58check = createBase58check(sha256)

const validateTronRecipient = (input: string): string | null => {
  try {
    const payload = base58check.decode(input)
    return payload.length === 21 && payload[0] === 0x41 ? input : null
  } catch {
    return null
  }
}

export const getSwapAddressFamily = (input: string): SwapAddressFamily | null => {
  if (validateEvmRecipient(input)) {
    return "evm"
  }
  if (validateSolanaRecipient(input)) {
    return "solana"
  }
  if (validateTronRecipient(input)) {
    return "tron"
  }

  return null
}
