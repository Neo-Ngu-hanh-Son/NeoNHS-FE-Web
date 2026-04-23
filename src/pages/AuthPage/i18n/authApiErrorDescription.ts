/**
 * Extract a human-readable message from typical axios / fetch errors.
 */
export function extractAuthApiRawMessage(err: unknown): string | undefined {
  if (err == null || typeof err !== 'object') return undefined
  const e = err as Record<string, unknown>
  const resp = e.response as Record<string, unknown> | undefined
  const data = resp?.data as Record<string, unknown> | undefined
  const candidates: unknown[] = [
    data?.message,
    data?.error,
    data?.detail,
    typeof data?.errors === 'object' && data?.errors !== null
      ? (Object.values(data.errors as Record<string, unknown>)[0] as unknown)
      : undefined,
    e.message,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim()
  }
  return undefined
}

type TFn = (key: string) => string

/** [regex, i18n key] — tested against lowercased raw message */
const AUTH_API_MESSAGE_RULES: Array<[RegExp, string]> = [
  [/invalid\s*otp|wrong\s*otp|otp\s*(is\s*)?invalid|otp\s*không|mã\s*otp/i, 'otp.verifyFailDefault'],
  [/expired\s*otp|otp\s*expired|otp\s*hết\s*hạn/i, 'errors.otpExpired'],
  [/invalid\s*credential|bad\s*credential|unauthori|wrong\s*password|incorrect\s*password|sai\s*mật\s*khẩu|đăng\s*nhập\s*thất/i, 'login.failDefault'],
  [/email\s*(already|exists|is\s*taken|registered)|user\s*exists|already\s*registered|email\s*đã\s*tồn\s*tại/i, 'errors.emailTaken'],
  [/user\s*not\s*found|account\s*not\s*found|no\s*user|không\s*tìm\s*thấy\s*tài\s*khoản/i, 'errors.userNotFound'],
  [/locked|disabled|banned|khóa|vô\s*hiệu/i, 'errors.accountLocked'],
  [/token\s*(invalid|expired)|reset\s*link|liên\s*kết/i, 'errors.resetTokenInvalid'],
  [/network|failed\s*to\s*fetch|econnrefused|timeout|kết\s*nối/i, 'errors.network'],
  [/500|internal\s*server|server\s*error|máy\s*chủ/i, 'errors.server'],
]

function matchAuthErrorToKey(raw: string): string | null {
  const s = raw.toLowerCase()
  for (const [re, key] of AUTH_API_MESSAGE_RULES) {
    if (re.test(s)) return key
  }
  return null
}

/**
 * Localized description for auth API failures.
 * Prefer mapping known backend phrases to i18n keys; otherwise use `fallbackKey`.
 */
export function authErrorDesc(err: unknown, t: TFn, fallbackKey = 'errors.genericBody'): string {
  const raw = extractAuthApiRawMessage(err)
  if (!raw) return t(fallbackKey)
  const key = matchAuthErrorToKey(raw)
  return key ? t(key) : t(fallbackKey)
}
