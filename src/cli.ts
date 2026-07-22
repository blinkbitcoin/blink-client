import { parsePaymentDestination } from "./parsing/index"

const args = process.argv.slice(2)

if (args.length < 1) {
  console.error(
    "Usage: pnpm cli <destination> [network] [lnAddressDomains] [phoneNumberLnAddressDomain]",
  )
  console.error("Example: pnpm cli +50370123456 mainnet blink.sv phone.example.com")
  process.exit(1)
}

const destination = args[0]
const network = args[1] || "mainnet" // Default to mainnet if not specified
const lnAddressDomains = args[2] ? args[2].split(",") : [] // Default to empty array if not specified
const phoneNumberLnAddressDomain = args[3]

try {
  const result = parsePaymentDestination({
    destination,
    network: network as "mainnet" | "signet" | "regtest",
    lnAddressDomains,
    phoneNumberLnAddressDomain,
  })

  console.info(JSON.stringify(result, null, 2))
} catch (error) {
  console.error("Error parsing payment destination:", error)
  process.exit(1)
}
