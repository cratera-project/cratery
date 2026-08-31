

const SALT_LENGTH = 16
const ITERATIONS = 100000
const KEY_LENGTH = 32
const HASH_ALGORITHM = 'SHA-256'


function generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
}


function toHex(buffer: Uint8Array): string {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}


function fromHex(hex: string): Uint8Array {
    const matches = hex.match(/.{1,2}/g)
    if (!matches) return new Uint8Array()
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)))
}


async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
    )

    
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: HASH_ALGORITHM,
        },
        keyMaterial,
        KEY_LENGTH * 8
    )

    return new Uint8Array(derivedBits)
}


export async function hashPassword(password: string): Promise<string> {
    const salt = generateSalt()
    const hash = await deriveKey(password, salt)
    return `${toHex(salt)}:${toHex(hash)}`
}


export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, hashHex] = storedHash.split(':')
    if (!saltHex || !hashHex) return false

    const salt = fromHex(saltHex)
    const expectedHash = fromHex(hashHex)
    const actualHash = await deriveKey(password, salt)

    
    if (actualHash.length !== expectedHash.length) return false
    
    let result = 0
    for (let i = 0; i < actualHash.length; i++) {
        result |= actualHash[i] ^ expectedHash[i]
    }
    return result === 0
}


export function generateToken(length: number = 32): string {
    const buffer = crypto.getRandomValues(new Uint8Array(length))
    return toHex(buffer)
}
