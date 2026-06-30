import crypto from "node:crypto";

/**
 * Generate a strong, human-friendly PDF password.
 * Format: BARBER-XXXX-XXXX-XXXX (alphanumeric, no ambiguous chars).
 */
export function generatePdfPassword() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from(
      { length: 4 },
      () => alphabet[crypto.randomInt(0, alphabet.length)],
    ).join("");
  return `BARBER-${block()}-${block()}-${block()}`;
}

export function generateDownloadToken() {
  return crypto.randomBytes(24).toString("base64url");
}
