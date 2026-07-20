import { getMatchingMerchants } from "."

describe("Boltz swap merchants", () => {
  const evmRecipient = "0x52908400098527886E0F7030069857D2E4169EE7"
  const solanaRecipient = "4wBqpZM9xaSheZzJSMawUKKwhdpChKbZ5eu5ky4Vigw"
  const tronRecipient = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
  const unsupportedLiquidRecipient = "ex1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0srvws"

  test("returns all EVM swap capabilities in declaration order", () => {
    const matches = getMatchingMerchants({ qrContent: evmRecipient, network: "mainnet" })

    expect(matches).toHaveLength(10)
    expect(matches.map(({ id }) => id)).toEqual([
      "blink-boltz-usdt-ethereum",
      "blink-boltz-usdt-polygon-pos",
      "blink-boltz-usdt-arbitrum",
      "blink-boltz-usdt-plasma",
      "blink-boltz-usdc-ethereum",
      "blink-boltz-usdc-base",
      "blink-boltz-usdc-arbitrum",
      "blink-boltz-usdc-polygon-pos",
      "blink-boltz-usdc-avalanche-c-chain",
      "blink-boltz-usdc-monad",
    ])
    expect(matches[0]).toEqual({
      id: "blink-boltz-usdt-ethereum",
      lnurl: `${evmRecipient}+USDT+Ethereum@swap.blink.sv`,
      category: "swap",
      title: "USDT Ethereum",
      description: "Swap sats to USDT on Ethereum",
      companyName: "Boltz",
      termsUrl: "https://boltz.exchange/terms",
    })
    expect(matches.find(({ id }) => id === "blink-boltz-usdt-polygon-pos")).toEqual(
      expect.objectContaining({
        lnurl: `${evmRecipient}+USDT+PolygonPoS@swap.blink.sv`,
        title: "USDT Polygon PoS",
        description: "Swap sats to USDT on Polygon PoS",
      }),
    )
    expect(matches.find(({ id }) => id === "blink-boltz-usdc-avalanche-c-chain")).toEqual(
      expect.objectContaining({
        lnurl: `${evmRecipient}+USDC+AvalancheCChain@swap.blink.sv`,
        title: "USDC Avalanche C-Chain",
        description: "Swap sats to USDC on Avalanche C-Chain",
      }),
    )
    expect(
      matches.every(
        (match) => !Object.prototype.hasOwnProperty.call(match, "displayCurrency"),
      ),
    ).toBe(true)
  })

  test("returns family-compatible swap capabilities", () => {
    expect(
      getMatchingMerchants({ qrContent: solanaRecipient, network: "mainnet" }).map(
        ({ lnurl }) => lnurl,
      ),
    ).toEqual([
      `${solanaRecipient}+USDT+Solana@swap.blink.sv`,
      `${solanaRecipient}+USDC+Solana@swap.blink.sv`,
    ])
    expect(
      getMatchingMerchants({ qrContent: tronRecipient, network: "mainnet" }).map(
        ({ lnurl }) => lnurl,
      ),
    ).toEqual([`${tronRecipient}+USDT+Tron@swap.blink.sv`])
    expect(
      getMatchingMerchants({ qrContent: unsupportedLiquidRecipient, network: "mainnet" }),
    ).toEqual([])
  })

  test("uses staging swap domains on signet and regtest", () => {
    expect(getMatchingMerchants({ qrContent: tronRecipient, network: "signet" })).toEqual(
      [
        expect.objectContaining({
          lnurl: `${tronRecipient}+USDT+Tron@swap.staging.blink.sv`,
        }),
      ],
    )
    expect(
      getMatchingMerchants({ qrContent: tronRecipient, network: "regtest" }),
    ).toEqual([
      expect.objectContaining({
        lnurl: `${tronRecipient}+USDT+Tron@swap.staging.blink.sv`,
      }),
    ])
  })

  test.each([
    {
      description: "lowercase EVM",
      recipient: "0xde709f2102306220921060314715629080e2fb77",
      count: 10,
    },
    {
      description: "uppercase EVM",
      recipient: "0XDE709F2102306220921060314715629080E2FB77",
      count: 10,
    },
    {
      description: "bad EVM checksum",
      recipient: "0x52908400098527886E0F7030069857D2E4169Ee7",
      count: 0,
    },
    {
      description: "bad EVM prefix",
      recipient: "52908400098527886E0F7030069857D2E4169EE7",
      count: 0,
    },
    {
      description: "short EVM",
      recipient: "0x52908400098527886E0F7030069857D2E4169E",
      count: 0,
    },
    {
      description: "non-hex EVM",
      recipient: "0x52908400098527886E0F7030069857D2E4169EG7",
      count: 0,
    },
    {
      description: "invalid Solana alphabet",
      recipient: "4wBqpZM9xaSheZzJSMawUKKwhdpChKbZ5eu5ky4VigO",
      count: 0,
    },
    { description: "short Solana", recipient: "2UzHL", count: 0 },
    {
      description: "long Solana",
      recipient: "KqvHYP9oZyLWk6yzkdJXPX8jBKXK5QagcDvGnyS4A59io",
      count: 0,
    },
    {
      description: "bad Tron checksum",
      recipient: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwc",
      count: 0,
    },
    {
      description: "invalid Tron version",
      recipient: "TZJozAg1ruapycCicgz31GxvYJ1G1qELV7",
      count: 0,
    },
    {
      description: "short Tron payload",
      recipient: "6vgvUCe6UMREQNmKiJ96L4nLvCGnfJ6N5",
      count: 0,
    },
    {
      description: "long Tron payload",
      recipient: "2zSb5yFtu3WugTVR2WG5UG5N9uzvBP2eLLBB",
      count: 0,
    },
  ])("validates swap recipient encodings: $description", ({ recipient, count }) => {
    expect(
      getMatchingMerchants({ qrContent: recipient, network: "mainnet" }),
    ).toHaveLength(count)
  })

  test.each([
    "ex1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0srvws",
    "lq1qqgqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpztehvrdr30n",
    "PwGP8BzRUHQwchwwPuzAe9WqskgmbKp88f",
    "VTpt5oiR6rTsr6ftQwQzUD8nb4PFhj8Dp3FNCqo4xfMHxcN9dmuKFfsF3Lb1bCZdqpuisAUHwvvLQ8Zw",
  ])("does not return unsupported Liquid route %s", (recipient) => {
    expect(getMatchingMerchants({ qrContent: recipient, network: "mainnet" })).toEqual([])
  })
})
