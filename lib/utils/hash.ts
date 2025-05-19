import crypto from "crypto"

/**
 * Creates a SHA-1 hash of the provided text
 */
export function sha1Hash(text: string): string {
  return crypto.createHash("sha1").update(text).digest("hex")
}

/**
 * Creates a preview of the message (first 50 characters)
 */
export function createMessagePreview(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Stores a message securely by hashing it and creating a preview
 */
export function secureMessage(text: string) {
  return {
    hash: sha1Hash(text),
    preview: createMessagePreview(text),
  }
}
