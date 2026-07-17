export const getIdentifierFromRegex =
  (regex: RegExp) =>
  (input: string): string | null =>
    input.match(regex)?.groups?.identifier ?? null
