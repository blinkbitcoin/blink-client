import type { Network } from "./types"
import {
  convertMerchantQRToLightningAddress,
  merchants,
  strictUriEncode,
} from "./merchants"

describe("convertMerchantQRToLightningAddress", () => {
  // Test cases for valid QR contents and networks
  test.each([
    {
      description: "PicknPay EMV QR code on mainnet",
      qrContent:
        "00020126260008za.co.mp0110248723666427530023za.co.electrum.picknpay0122ydgKJviKSomaVw0297RaZw5303710540571.406304CE9C",
      network: "mainnet" as Network,
      expected:
        "00020126260008za.co.mp0110248723666427530023za.co.electrum.picknpay0122ydgKJviKSomaVw0297RaZw5303710540571.406304CE9C@cryptoqr.net",
    },
    {
      description: "PicknPay EMV QR code on signet",
      qrContent:
        "00020126260008za.co.mp0110628654976427530023za.co.electrum.picknpay0122a/r4RBWjSNGflZtjFg4VJQ530371054041.2363044A53",
      network: "signet" as Network,
      expected:
        "00020126260008za.co.mp0110628654976427530023za.co.electrum.picknpay0122a%2Fr4RBWjSNGflZtjFg4VJQ530371054041.2363044A53@staging.cryptoqr.net",
    },
    {
      description: "Ecentric EMV QR code on mainnet",
      qrContent:
        "00020129530019za.co.ecentric.payment0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
      expected:
        "00020129530019za.co.ecentric.payment0122RD2HAK3KTI53EC%2Fconfirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    },
    {
      description: "PicknPay QR code with uppercase content",
      qrContent:
        "00020129530023ZA.CO.ELECTRUM.PICKNPAY0122RD2HAK3KTI53EC/CONFIRM520458125303710540115802ZA5916CRYPTOQRTESTSCAN6002CT63049BE2",
      network: "mainnet" as Network,
      expected:
        "00020129530023ZA.CO.ELECTRUM.PICKNPAY0122RD2HAK3KTI53EC%2FCONFIRM520458125303710540115802ZA5916CRYPTOQRTESTSCAN6002CT63049BE2@cryptoqr.net",
    },
    {
      description: "Ecentric QR code with mixed case",
      qrContent:
        "00020129530019Za.Co.EcEnTrIc.payment0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
      expected:
        "00020129530019Za.Co.EcEnTrIc.payment0122RD2HAK3KTI53EC%2Fconfirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    },
    {
      description: "PicknPay QR code with Unicode characters",
      qrContent:
        "00020129530023za.co.electrum.picknpay0122RD2HAK3KTI53EC/confirm★測試520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
      expected:
        "00020129530023za.co.electrum.picknpay0122RD2HAK3KTI53EC%2Fconfirm%E2%98%85%E6%B8%AC%E8%A9%A6520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    },
    {
      description: "Ecentric QR code with emoji",
      qrContent:
        "00020129530019za.co.ecentric.payment0122RD2HAK3KTI53EC/confirm🎉test520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
      expected:
        "00020129530019za.co.ecentric.payment0122RD2HAK3KTI53EC%2Fconfirm%F0%9F%8E%89test520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    },
    {
      description: "Bootlegger QR code",
      qrContent: "https://za.wigroup.co/bill/415267598",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fza.wigroup.co%2Fbill%2F415267598@cryptoqr.net",
    },
    {
      description: "Zapper QR code with zap.pe domain",
      qrContent:
        "http://pay.zapper.com?t=6&i=40895:49955:7[34|0.00|3:10[39|ZAR,38|DillonDev",
      network: "mainnet" as Network,
      expected:
        "http%3A%2F%2Fpay.zapper.com%3Ft%3D6%26i%3D40895%3A49955%3A7%5B34%7C0.00%7C3%3A10%5B39%7CZAR%2C38%7CDillonDev@cryptoqr.net",
    },
    {
      description: "Zapper QR code with zapper domain",
      qrContent: "http://2.zap.pe?t=6&i=40895:49955:7[34|0.00|3:10[39|ZAR,38|DillonDev",
      network: "mainnet" as Network,
      expected:
        "http%3A%2F%2F2.zap.pe%3Ft%3D6%26i%3D40895%3A49955%3A7%5B34%7C0.00%7C3%3A10%5B39%7CZAR%2C38%7CDillonDev@cryptoqr.net",
    },
    {
      description: "Zapper QR code with zap.pe domain",
      qrContent: `http://5.zap.pe?t=4&i=rAT%)=o\\O'Bd2Cl!WXAE('"=7F>)aN!<>?YJ-3ad!l+gR:Ms_d6t(?\`:Msuo(3!l"AoVg2Gq^paT]Z?Y"98E32\`WZS1,L\`f!!!'g('4I;"u.qo!!3-#/*^XK!!-%alYMQ:O@#?E!<<*"!!-5+`,
      network: "mainnet" as Network,
      expected:
        "http%3A%2F%2F5.zap.pe%3Ft%3D4%26i%3DrAT%25%29%3Do%5CO%27Bd2Cl%21WXAE%28%27%22%3D7F%3E%29aN%21%3C%3E%3FYJ-3ad%21l%2BgR%3AMs_d6t%28%3F%60%3AMsuo%283%21l%22AoVg2Gq%5EpaT%5DZ%3FY%2298E32%60WZS1%2CL%60f%21%21%21%27g%28%274I%3B%22u.qo%21%213-%23%2F%2A%5EXK%21%21-%25alYMQ%3AO%40%23%3FE%21%3C%3C%2A%22%21%21-5%2B@cryptoqr.net",
    },
    {
      description: "Pay@ Bill Payment QR codes",
      qrContent: "ab/abcd/abcdefghijklmnopqrst",
      network: "mainnet" as Network,
      expected: "ab%2Fabcd%2Fabcdefghijklmnopqrst@cryptoqr.net",
    },
    {
      description: "Matches payat.io URL",
      qrContent: "https://portal.payat.io/transactions/view?id=12345",
      network: "mainnet" as Network,
      expected:
        "https%3A%2F%2Fportal.payat.io%2Ftransactions%2Fview%3Fid%3D12345@cryptoqr.net",
    },
    {
      description: "Matches paynow.netcash.co.za URL",
      qrContent: "https://paynow.netcash.co.za/qr/ABCDEF123456",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fpaynow.netcash.co.za%2Fqr%2FABCDEF123456@cryptoqr.net",
    },
    {
      description: "Matches paynow.sagepay.co.za URL",
      qrContent: "https://paynow.sagepay.co.za/pay/XYZ789",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fpaynow.sagepay.co.za%2Fpay%2FXYZ789@cryptoqr.net",
    },
    {
      description: "Standard Bank’s Scan to Pay / SnapScan–style reference",
      qrContent: "SK-123-12345678901234567890123",
      network: "mainnet" as Network,
      expected: "SK-123-12345678901234567890123@cryptoqr.net",
    },
    {
      description: "Matches transactionjunction.co.za URL",
      qrContent: "https://www.transactionjunction.co.za/receipt/12345",
      network: "mainnet" as Network,
      expected:
        "https%3A%2F%2Fwww.transactionjunction.co.za%2Freceipt%2F12345@cryptoqr.net",
    },
    {
      description: "Certain parking ticket formats (Servest Parking)",
      qrContent: "CRSTPC-12-345-6789-10-11",
      network: "mainnet" as Network,
      expected: "CRSTPC-12-345-6789-10-11@cryptoqr.net",
    },
    {
      description: "ScanToPay URL",
      qrContent: "https://qa.scantopay.io/pluto/public/qr/8784599487",
      network: "mainnet" as Network,
      expected:
        "https%3A%2F%2Fqa.scantopay.io%2Fpluto%2Fpublic%2Fqr%2F8784599487@cryptoqr.net",
    },
    {
      description: "ScanToPay URL",
      qrContent: "https://app.scantopay.io/qr?qrcode=8962148867",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fapp.scantopay.io%2Fqr%3Fqrcode%3D8962148867@cryptoqr.net",
    },
    {
      description: "ScanToPay URL",
      qrContent: "https://pos.snapscan.io/qr/STB2ACC8",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fpos.snapscan.io%2Fqr%2FSTB2ACC8@cryptoqr.net",
    },
    {
      description: "ScanToPay 10-digit code",
      qrContent: "8784599487",
      network: "mainnet" as Network,
      expected: "8784599487@cryptoqr.net",
    },
    {
      description: "Snapscan QR code",
      qrContent: "https://pos.snapscan.io/qr/STB2ACC8",
      network: "mainnet" as Network,
      expected: "https%3A%2F%2Fpos.snapscan.io%2Fqr%2FSTB2ACC8@cryptoqr.net",
    },
  ])("$description", ({ qrContent, network, expected }) => {
    const result = convertMerchantQRToLightningAddress({ qrContent, network })
    expect(result).toBe(expected)
  })

  // Test cases for invalid QR contents
  test.each([
    {
      description: "non-matching merchant in EMV format",
      qrContent:
        "00020129530023other.merchant.code0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
    },
    {
      description: "empty QR content",
      qrContent: "",
      network: "mainnet" as Network,
    },
    {
      description: "malformed EMV QR format",
      qrContent: "000201za.co.picknpay",
      network: "mainnet" as Network,
    },
    {
      description: "invalid merchant identifier",
      qrContent: "Nakamoto+btc",
      network: "mainnet" as Network,
    },
    {
      description: "invalid merchant identifier in EMV format",
      qrContent:
        "00020129530023za.co.unknown.merchant0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2",
      network: "mainnet" as Network,
    },
    {
      description: "10 digits with other text",
      qrContent: "Call me at 1234567890 for more details",
      network: "mainnet" as Network,
    },
  ])("returns null for $description", ({ qrContent, network }) => {
    const result = convertMerchantQRToLightningAddress({ qrContent, network })
    expect(result).toBeNull()
  })

  // Edge cases and special scenarios
  test("returns null when multiple merchant identifiers in the same QR content", () => {
    const qrContent =
      "00020129530023za.co.electrum.picknpay.za.co.ecentric0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2"
    const result = convertMerchantQRToLightningAddress({
      qrContent,
      network: "mainnet",
    })
    expect(result).toBeNull()
  })

  test("handles URL-unsafe characters in EMV format", () => {
    const qrContent =
      "00020129530023za.co.electrum.picknpay0122RD2HAK3KTI53EC?param=value&other=123520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2"
    const result = convertMerchantQRToLightningAddress({
      qrContent,
      network: "mainnet",
    })
    expect(result).toBe(
      "00020129530023za.co.electrum.picknpay0122RD2HAK3KTI53EC%3Fparam%3Dvalue%26other%3D123520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    )
  })

  test("preserves original case in EMV format", () => {
    const qrContent =
      "00020129530023ZA.co.ELECTRUM.picknpay0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2"
    const result = convertMerchantQRToLightningAddress({
      qrContent,
      network: "mainnet",
    })
    expect(result).toBe(
      "00020129530023ZA.co.ELECTRUM.picknpay0122RD2HAK3KTI53EC%2Fconfirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    )
  })
})

describe("convertMerchantQRToLightningAddress with displayCurrency", () => {
  const originalMerchants = [...merchants]

  beforeEach(() => {
    merchants.length = 0
    merchants.push(
      {
        id: "test-usd",
        identifierRegex: /(?<identifier>.*test-payment.*)/iu,
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
        identifierRegex: /(?<identifier>.*test-payment.*)/iu,
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

  test("selects merchant with matching displayCurrency (exact match)", () => {
    const result = convertMerchantQRToLightningAddress({
      qrContent: "test-payment-qr",
      network: "mainnet",
      displayCurrency: "USD",
    })

    expect(result).toBe("test-payment-qr@usd-merchant.com")
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
      identifierRegex: /(?<identifier>.*test-payment.*)/iu,
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
