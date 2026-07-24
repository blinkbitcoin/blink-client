import {
  convertMerchantQRToLightningAddress,
  getIdentifierFromRegex,
  merchants,
  strictUriEncode,
} from "."
import { normalizeMerchantInput } from "./helpers"

describe("getIdentifierFromRegex", () => {
  test("returns the named identifier group", () => {
    const getIdentifier = getIdentifierFromRegex(
      /prefix-(?<identifier>[a-z0-9]+)-suffix/iu,
    )

    expect(getIdentifier("prefix-abc123-suffix")).toBe("abc123")
    expect(getIdentifier("prefix-abc123-other")).toBeNull()
  })
})

describe("normalizeMerchantInput", () => {
  const recipientAddress = "0x52908400098527886E0F7030069857D2E4169EE7"
  const solanaRecipient = "4wBqpZM9xaSheZzJSMawUKKwhdpChKbZ5eu5ky4Vigw"
  const tronRecipient = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"

  test.each([
    [`ethereum:${recipientAddress}`, recipientAddress],
    [`solana:${recipientAddress}?amount=1`, recipientAddress],
    [`ethereum:pay-${recipientAddress}@1/transfer?uint256=100`, recipientAddress],
    [
      `custom:${recipientAddress}+USDC+Arbitrum?amount=1`,
      `${recipientAddress}+USDC+Arbitrum`,
    ],
    [`solana:${solanaRecipient}/transfer?amount=1`, solanaRecipient],
    [`tron:${tronRecipient}?amount=1`, tronRecipient],
    ["https://pos.snapscan.io/qr/STB2ACC8", "https://pos.snapscan.io/qr/STB2ACC8"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeMerchantInput(input)).toBe(expected)
  })
})

describe("convertMerchantQRToLightningAddress with displayCurrency", () => {
  const originalMerchants = [...merchants]

  beforeEach(() => {
    merchants.length = 0
    merchants.push(
      {
        id: "test-usd",
        category: "merchant-payment",
        title: "Test Usd",
        description: "",
        companyName: "Money Badger",
        termsUrl: "https://www.moneybadger.co.za/deals/terms-and-conditions",
        getIdentifier: getIdentifierFromRegex(/(?<identifier>.*test-payment.*)/iu),
        defaultDomain: "usd-merchant.com",
        domains: {
          mainnet: "usd-merchant.com",
          signet: "staging.usd-merchant.com",
          regtest: "staging.usd-merchant.com",
        },
        displayCurrency: "USD",
      },
      {
        id: "test-zar",
        category: "merchant-payment",
        title: "Test Zar",
        description: "",
        companyName: "Money Badger",
        termsUrl: "https://www.moneybadger.co.za/deals/terms-and-conditions",
        getIdentifier: getIdentifierFromRegex(/(?<identifier>.*test-payment.*)/iu),
        defaultDomain: "zar-merchant.com",
        domains: {
          mainnet: "zar-merchant.com",
          signet: "staging.zar-merchant.com",
          regtest: "staging.zar-merchant.com",
        },
        displayCurrency: "ZAR",
      },
    )
  })

  afterEach(() => {
    merchants.length = 0
    merchants.push(...originalMerchants)
  })

  test("selects merchant with matching displayCurrency", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
      displayCurrency: "USD",
    })

    expect(result).toBe("test-payment-qr@usd-merchant.com")
  })

  test("passes non-Boltz merchant content through without URI normalization", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "custom:test-payment-qr?amount=1",
      network: "mainnet",
      displayCurrency: "USD",
    })

    expect(result).toBe("custom%3Atest-payment-qr%3Famount%3D1@usd-merchant.com")
  })

  test("handles case-insensitive displayCurrency matching", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
      displayCurrency: "zar",
    })

    expect(result).toBe("test-payment-qr@zar-merchant.com")
  })

  test("trims displayCurrency whitespace", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
      displayCurrency: "  USD  ",
    })

    expect(result).toBe("test-payment-qr@usd-merchant.com")
  })

  test("returns null when multiple merchants match and no displayCurrency provided", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
    })

    expect(result).toBeNull()
  })

  test("returns null when multiple merchants match and displayCurrency does not match", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
      displayCurrency: "EUR",
    })

    expect(result).toBeNull()
  })

  test("returns merchant when only one matches regardless of displayCurrency", () => {
    merchants.length = 0
    merchants.push({
      id: "test-single",
      category: "merchant-payment",
      title: "Test Single",
      description: "",
      companyName: "Money Badger",
      termsUrl: "https://www.moneybadger.co.za/deals/terms-and-conditions",
      getIdentifier: getIdentifierFromRegex(/(?<identifier>.*test-payment.*)/iu),
      defaultDomain: "single-merchant.com",
      domains: {
        mainnet: "single-merchant.com",
        signet: "staging.single-merchant.com",
        regtest: "staging.single-merchant.com",
      },
      displayCurrency: "USD",
    })

    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
    })

    expect(result).toBe("test-payment-qr@single-merchant.com")
  })

  test("returns null when multiple merchants match the requested currency", () => {
    merchants.push({
      id: "test-zar-duplicate",
      category: "merchant-payment",
      title: "Test Zar Duplicate",
      description: "",
      companyName: "Money Badger",
      termsUrl: "https://www.moneybadger.co.za/deals/terms-and-conditions",
      getIdentifier: getIdentifierFromRegex(/(?<identifier>.*test-payment.*)/iu),
      defaultDomain: "zar-duplicate-merchant.com",
      domains: {
        mainnet: "zar-duplicate-merchant.com",
        signet: "staging.zar-duplicate-merchant.com",
        regtest: "staging.zar-duplicate-merchant.com",
      },
      displayCurrency: "ZAR",
    })

    expect(
      convertMerchantQRToLightningAddress({
        qrContent: "test-payment-qr",
        network: "mainnet",
        displayCurrency: "ZAR",
      }),
    ).toBeNull()
  })
})

describe("strictUriEncode", () => {
  test("encodes exclamation mark", () => {
    expect(strictUriEncode("unicorn!foobar")).toBe("unicorn%21foobar")
  })

  test("encodes single quote", () => {
    expect(strictUriEncode("unicorn'foobar")).toBe("unicorn%27foobar")
  })

  test("encodes asterisk", () => {
    expect(strictUriEncode("unicorn*foobar")).toBe("unicorn%2Afoobar")
  })

  test("encodes opening parenthesis", () => {
    expect(strictUriEncode("unicorn(foobar")).toBe("unicorn%28foobar")
  })

  test("encodes closing parenthesis", () => {
    expect(strictUriEncode("unicorn)foobar")).toBe("unicorn%29foobar")
  })

  test("encodes multiple special characters", () => {
    expect(strictUriEncode("unicorn!'()*foobar")).toBe("unicorn%21%27%28%29%2Afoobar")
  })

  test("produces different result from encodeURIComponent for asterisk", () => {
    const input = "unicorn*foobar"
    expect(strictUriEncode(input)).not.toBe(encodeURIComponent(input))
    expect(strictUriEncode(input)).toBe("unicorn%2Afoobar")
    expect(encodeURIComponent(input)).toBe("unicorn*foobar")
  })

  test("handles strings without special characters", () => {
    expect(strictUriEncode("unicornfoobar")).toBe("unicornfoobar")
  })

  test("handles empty string", () => {
    expect(strictUriEncode("")).toBe("")
  })

  test("handles numbers", () => {
    expect(strictUriEncode(123)).toBe("123")
  })

  test("handles boolean values", () => {
    expect(strictUriEncode(true)).toBe("true")
    expect(strictUriEncode(false)).toBe("false")
  })

  test("encodes URL-unsafe characters along with RFC 3986 reserved characters", () => {
    expect(strictUriEncode("hello world!")).toBe("hello%20world%21")
    expect(strictUriEncode("test/path")).toBe("test%2Fpath")
    expect(strictUriEncode("a=b&c=d")).toBe("a%3Db%26c%3Dd")
    expect(strictUriEncode("test?query")).toBe("test%3Fquery")
  })

  test("handles Unicode characters", () => {
    expect(strictUriEncode("测试")).toBe("%E6%B5%8B%E8%AF%95")
    expect(strictUriEncode("hello!测试")).toBe("hello%21%E6%B5%8B%E8%AF%95")
  })
})
