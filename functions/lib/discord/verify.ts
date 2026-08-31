function hexToUint8Array(hex: string): Uint8Array {
  const clean = hex.trim()
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}


export async function verifyDiscordRequest(
  rawBody: string,
  signature: string | null,
  timestamp: string | null,
  clientPublicKey: string
): Promise<boolean> {
  if (!signature || !timestamp || !clientPublicKey) {
    return false
  }

  try {
    const pubKeyBytes = hexToUint8Array(clientPublicKey)
    const sigBytes = hexToUint8Array(signature)
    const msgBytes = new TextEncoder().encode(timestamp + rawBody)

    const key = await crypto.subtle.importKey(
      'raw',
      pubKeyBytes,
      { name: 'Ed25519' },
      false,
      ['verify']
    )

    return await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      sigBytes,
      msgBytes
    )
  } catch (err) {
    console.error('[discord-verify] Signature verification failed:', err)
    return false
  }
}
