import { getMatchingMerchants } from "."

describe("Boltz swap merchants", () => {
  const evmRecipient = "0x52908400098527886E0F7030069857D2E4169EE7"
  const solanaRecipient = "4wBqpZM9xaSheZzJSMawUKKwhdpChKbZ5eu5ky4Vigw"
  const tronRecipient = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"

  test("returns all EVM swap capabilities in declaration order", () => {
    const matches = getMatchingMerchants({ qrContent: evmRecipient, network: "mainnet" })

    expect(matches).toHaveLength(10)
    expect(matches.map(({ id }) => id)).toEqual([
      "blink-boltz-usdc-arbitrum",
      "blink-boltz-usdc-avalanche-c-chain",
      "blink-boltz-usdc-base",
      "blink-boltz-usdc-ethereum",
      "blink-boltz-usdc-monad",
      "blink-boltz-usdc-polygon-pos",
      "blink-boltz-usdt-arbitrum",
      "blink-boltz-usdt-ethereum",
      "blink-boltz-usdt-plasma",
      "blink-boltz-usdt-polygon-pos",
    ])
    expect(matches.find(({ id }) => id === "blink-boltz-usdt-ethereum")).toEqual({
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
      `${solanaRecipient}+USDC+Solana@swap.blink.sv`,
      `${solanaRecipient}+USDT+Solana@swap.blink.sv`,
    ])
    expect(
      getMatchingMerchants({ qrContent: tronRecipient, network: "mainnet" }).map(
        ({ lnurl }) => lnurl,
      ),
    ).toEqual([`${tronRecipient}+USDT+Tron@swap.blink.sv`])
  })

  test("filters swap capabilities by configured asset", () => {
    expect(
      getMatchingMerchants({
        qrContent: `${evmRecipient}+USDC`,
        network: "mainnet",
      }).map(({ id }) => id),
    ).toEqual([
      "blink-boltz-usdc-arbitrum",
      "blink-boltz-usdc-avalanche-c-chain",
      "blink-boltz-usdc-base",
      "blink-boltz-usdc-ethereum",
      "blink-boltz-usdc-monad",
      "blink-boltz-usdc-polygon-pos",
    ])
    expect(
      getMatchingMerchants({
        qrContent: `${evmRecipient}+usdt`,
        network: "mainnet",
      }).map(({ id }) => id),
    ).toEqual([
      "blink-boltz-usdt-arbitrum",
      "blink-boltz-usdt-ethereum",
      "blink-boltz-usdt-plasma",
      "blink-boltz-usdt-polygon-pos",
    ])
  })

  test.each([
    [`${evmRecipient}+USDT+Ethereum`, "blink-boltz-usdt-ethereum"],
    [`${evmRecipient}+USDT+PolygonPoS`, "blink-boltz-usdt-polygon-pos"],
    [`${evmRecipient}+USDT+Arbitrum`, "blink-boltz-usdt-arbitrum"],
    [`${evmRecipient}+USDT+Plasma`, "blink-boltz-usdt-plasma"],
    [`${evmRecipient}+USDC+Ethereum`, "blink-boltz-usdc-ethereum"],
    [`${evmRecipient}+USDC+Base`, "blink-boltz-usdc-base"],
    [`${evmRecipient}+USDC+Arbitrum`, "blink-boltz-usdc-arbitrum"],
    [`${evmRecipient}+USDC+PolygonPoS`, "blink-boltz-usdc-polygon-pos"],
    [`${evmRecipient}+USDC+AvalancheCChain`, "blink-boltz-usdc-avalanche-c-chain"],
    [`${evmRecipient}+USDC+Monad`, "blink-boltz-usdc-monad"],
    [`${solanaRecipient}+USDT+Solana`, "blink-boltz-usdt-solana"],
    [`${solanaRecipient}+USDC+Solana`, "blink-boltz-usdc-solana"],
    [`${tronRecipient}+USDT+Tron`, "blink-boltz-usdt-tron"],
  ])("filters swap capabilities by configured asset and network: %s", (qrContent, id) => {
    expect(getMatchingMerchants({ qrContent, network: "mainnet" })).toEqual([
      expect.objectContaining({ id }),
    ])
  })

  test.each([
    `${evmRecipient}+USDC+Arbitrum`,
    `${evmRecipient}+USDC+arbitrum`,
    `${evmRecipient}+usdc+Arbitrum`,
  ])("builds canonical swap lnurls for filtered route %s", (qrContent) => {
    expect(getMatchingMerchants({ qrContent, network: "mainnet" })).toEqual([
      expect.objectContaining({
        lnurl: `${evmRecipient}+USDC+Arbitrum@swap.blink.sv`,
        title: "USDC Arbitrum",
      }),
    ])
  })

  test.each([
    `${tronRecipient}+USDC`,
    `${tronRecipient}+USDC+Tron`,
    `${solanaRecipient}+USDT+Ethereum`,
    `${evmRecipient}+USDT+Base`,
    `${evmRecipient}+BTC`,
    `${evmRecipient}+USDC+UnknownNetwork`,
    `${evmRecipient}+USDC+Arbitrum+Extra`,
    `${evmRecipient}+`,
    `${evmRecipient}++Arbitrum`,
    `not-a-valid-swap-recipient+USDC`,
  ])("does not return unsupported filtered swap route %s", (qrContent) => {
    expect(getMatchingMerchants({ qrContent, network: "mainnet" })).toEqual([])
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
})
