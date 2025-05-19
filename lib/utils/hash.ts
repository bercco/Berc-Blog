import CryptoJS from "crypto-js"

// Function to hash a message using SHA-1
export async function hashMessage(message: string): Promise<string> {
  return CryptoJS.SHA1(message).toString()
}

// Function to verify a message against a hash
export async function verifyMessage(message: string, hash: string): Promise<boolean> {
  const messageHash = await hashMessage(message)
  return messageHash === hash
}

// Function to store a message securely
export async function storeMessage(message: string): Promise<{ hash: string; preview: string }> {
  const hash = await hashMessage(message)
  const preview = message.length > 50 ? `${message.substring(0, 50)}...` : message
  return { hash, preview }
}
