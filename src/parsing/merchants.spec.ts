import type { Network } from "./types"
import { convertMerchantQRToLightningAddress } from "./merchants"

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
      description: "ScanToPay QR code",
      qrContent: "https://qa.scantopay.io/pluto/public/qr/8784599487",
      network: "mainnet" as Network,
      expected:
        "https%3A%2F%2Fqa.scantopay.io%2Fpluto%2Fpublic%2Fqr%2F8784599487@cryptoqr.net",
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
  ])("returns null for $description", ({ qrContent, network }) => {
    const result = convertMerchantQRToLightningAddress({ qrContent, network })
    expect(result).toBeNull()
  })

  // Edge cases and special scenarios
  test("handles multiple merchant identifiers in the same QR content", () => {
    const qrContent =
      "00020129530023za.co.electrum.picknpay.za.co.ecentric0122RD2HAK3KTI53EC/confirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2"
    const result = convertMerchantQRToLightningAddress({
      qrContent,
      network: "mainnet",
    })
    expect(result).toBe(
      "00020129530023za.co.electrum.picknpay.za.co.ecentric0122RD2HAK3KTI53EC%2Fconfirm520458125303710540115802ZA5916cryptoqrtestscan6002CT63049BE2@cryptoqr.net",
    )
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
