export const getIdentifierFromRegex =
  (regex: RegExp) =>
  (input: string): string | null =>
    input.match(regex)?.groups?.identifier ?? null

const uriScheme = /^([a-z][a-z0-9+.-]*):(.*)$/iu

const normalizeMerchantUriPayload = (payload: string): string => {
  const withoutLeadingSlashes = payload.replace(/^\/+/u, "")
  const withoutQueryOrHash = withoutLeadingSlashes.split(/[?#]/u)[0]
  const withoutPayPrefix = withoutQueryOrHash.toLowerCase().startsWith("pay-")
    ? withoutQueryOrHash.slice(4)
    : withoutQueryOrHash

  return withoutPayPrefix.split(/[/?@]/u)[0]
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
