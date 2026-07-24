export const getIdentifierFromRegex =
  (regex: RegExp) =>
  (input: string): string | null =>
    input.match(regex)?.groups?.identifier ?? null

const uriScheme = /^([a-z][a-z0-9+.-]*):(.*)$/iu
const addressWithRoute = /^(?<address>0x[0-9a-f]{40})(?<rest>.*)$/iu

const normalizeMerchantUriPayload = (payload: string): string => {
  const withoutQueryOrHash = payload.split(/[?#]/u)[0]
  const eip681Payload = withoutQueryOrHash.toLowerCase().startsWith("pay-0x")
    ? withoutQueryOrHash.slice(4)
    : withoutQueryOrHash

  const addressMatch = eip681Payload.match(addressWithRoute)
  if (addressMatch?.groups?.address) {
    const route = addressMatch.groups.rest.match(/^\+[^@/?#]*/u)?.[0] ?? ""
    return `${addressMatch.groups.address}${route}`
  }

  return eip681Payload.split(/[/?@]/u)[0]
}

export const normalizeMerchantInput = (input: string): string => {
  const trimmed = input.trim()
  const schemeMatch = trimmed.match(uriScheme)
  if (!schemeMatch?.[1] || !schemeMatch[2]) {
    return trimmed
  }

  const scheme = schemeMatch[1].toLowerCase()
  if (scheme === "http" || scheme === "https") {
    return trimmed
  }

  const normalized = normalizeMerchantUriPayload(schemeMatch[2].trim())
  return normalized || trimmed
}
