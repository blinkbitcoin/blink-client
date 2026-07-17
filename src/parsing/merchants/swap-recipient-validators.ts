import { bech32, bech32m, base58, createBase58check, hex, utils } from "@scure/base"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 as keccak256 } from "@noble/hashes/sha3"
import { BLECH32, BLECH32M, decode as decodeBlech32 } from "blech32"

export type SwapAddressFamily = "evm" | "solana" | "tron" | "liquid"

const isCompressedPublicKey = (bytes: Uint8Array): boolean => {
  return bytes.length === 33 && (bytes[0] === 0x02 || bytes[0] === 0x03)
}

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

const isValidWitnessProgram = ({
  version,
  program,
  expectedEncoding,
}: {
  version: number
  program: Uint8Array
  expectedEncoding: "bech32" | "bech32m"
}): boolean => {
  if (version < 0 || version > 16 || program.length < 2 || program.length > 40) {
    return false
  }

  if (version === 0) {
    return (
      expectedEncoding === "bech32" && (program.length === 20 || program.length === 32)
    )
  }

  return expectedEncoding === "bech32m"
}

const validateStandardLiquidSegwitRecipient = (input: string): string | null => {
  for (const [decoder, expectedEncoding] of [
    [bech32, "bech32"],
    [bech32m, "bech32m"],
  ] as const) {
    try {
      const decoded = decoder.decode(input as `${string}1${string}`, false)
      const [version, ...programWords] = decoded.words
      const program = decoder.fromWords(programWords)
      if (
        decoded.prefix === "ex" &&
        isValidWitnessProgram({ version, program, expectedEncoding })
      ) {
        return input
      }
    } catch {
      // Try the other witness checksum encoding.
    }
  }

  return null
}

const validateConfidentialLiquidSegwitRecipient = (input: string): string | null => {
  for (const [encoding, expectedEncoding] of [
    [BLECH32, "bech32"],
    [BLECH32M, "bech32m"],
  ] as const) {
    try {
      const decoded = decodeBlech32(input, encoding)
      const [version, ...programWords] = decoded.data
      const program = Uint8Array.from(utils.convertRadix2([...programWords], 5, 8, false))
      const blindingPublicKey = program.slice(0, 33)
      const witnessProgram = program.slice(33)
      if (
        decoded.hrp === "lq" &&
        isCompressedPublicKey(blindingPublicKey) &&
        isValidWitnessProgram({
          version,
          program: witnessProgram,
          expectedEncoding,
        })
      ) {
        return input
      }
    } catch {
      // Try the other witness checksum encoding.
    }
  }

  return null
}

const validateLiquidLegacyRecipient = (input: string): string | null => {
  try {
    const payload = base58check.decode(input)
    const [version] = payload

    if (payload.length === 21 && (version === 57 || version === 39)) {
      return input
    }

    if (
      payload.length === 55 &&
      payload[0] === 12 &&
      (payload[1] === 57 || payload[1] === 39) &&
      isCompressedPublicKey(payload.slice(2, 35))
    ) {
      return input
    }
  } catch {
    return null
  }

  return null
}

const validateLiquidRecipient = (input: string): string | null => {
  return (
    validateStandardLiquidSegwitRecipient(input) ??
    validateConfidentialLiquidSegwitRecipient(input) ??
    validateLiquidLegacyRecipient(input)
  )
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
  if (validateLiquidRecipient(input)) {
    return "liquid"
  }

  return null
}
