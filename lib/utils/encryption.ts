/**
 * Encryption utilities for sensitive emotional data
 * Uses AES encryption with crypto-js for client-side data protection
 */

import CryptoJS from 'crypto-js'

export interface EncryptionResult {
  encryptedData: string
  iv: string
  salt: string
}

export interface DecryptionRequest {
  encryptedData: string
  iv: string
  salt: string
  key: string
}

class EncryptionService {
  private readonly keySize = 256
  private readonly ivSize = 128
  private readonly saltSize = 128
  private readonly iterations = 10000

  /**
   * Generate a secure encryption key from a user password
   */
  generateKeyFromPassword(password: string, salt?: string): string {
    const useSalt = salt || CryptoJS.lib.WordArray.random(this.saltSize / 8).toString()
    const key = CryptoJS.PBKDF2(password, useSalt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    })
    return key.toString()
  }

  /**
   * Generate a random salt for key derivation
   */
  generateSalt(): string {
    return CryptoJS.lib.WordArray.random(this.saltSize / 8).toString()
  }

  /**
   * Encrypt sensitive data using AES encryption
   */
  encryptData(data: any, userKey: string): EncryptionResult {
    try {
      // Convert data to JSON string if it's an object
      const dataString = typeof data === 'string' ? data : JSON.stringify(data)
      
      // Generate random IV for this encryption
      const iv = CryptoJS.lib.WordArray.random(this.ivSize / 8)
      const salt = this.generateSalt()
      
      // Derive encryption key from user key and salt
      const key = CryptoJS.PBKDF2(userKey, salt, {
        keySize: this.keySize / 32,
        iterations: this.iterations
      })
      
      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(dataString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      
      return {
        encryptedData: encrypted.toString(),
        iv: iv.toString(),
        salt: salt
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data using AES decryption
   */
  decryptData(request: DecryptionRequest): any {
    try {
      // Derive the same key using the stored salt
      const key = CryptoJS.PBKDF2(request.key, request.salt, {
        keySize: this.keySize / 32,
        iterations: this.iterations
      })
      
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(request.encryptedData, key, {
        iv: CryptoJS.enc.Hex.parse(request.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedString) {
        throw new Error('Decryption failed - invalid key or corrupted data')
      }
      
      // Try to parse as JSON, return as string if parsing fails
      try {
        return JSON.parse(decryptedString)
      } catch {
        return decryptedString
      }
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt data - invalid key or corrupted data')
    }
  }

  /**
   * Generate a secure hash for data integrity verification
   */
  generateDataHash(data: any): string {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data)
    return CryptoJS.SHA256(dataString).toString()
  }

  /**
   * Verify data integrity using hash comparison
   */
  verifyDataIntegrity(data: any, expectedHash: string): boolean {
    const currentHash = this.generateDataHash(data)
    return currentHash === expectedHash
  }

  /**
   * Securely wipe sensitive data from memory (best effort)
   */
  secureWipe(sensitiveString: string): void {
    if (typeof sensitiveString === 'string') {
      // Overwrite the string content (limited effectiveness in JS)
      try {
        // This is more of a symbolic gesture in JavaScript
        // as strings are immutable and garbage collection handles memory
        sensitiveString = '0'.repeat(sensitiveString.length)
      } catch {
        // Ignore errors in secure wipe attempt
      }
    }
  }

  /**
   * Generate a random encryption key for new users
   */
  generateRandomKey(): string {
    return CryptoJS.lib.WordArray.random(this.keySize / 8).toString()
  }

  /**
   * Key strengthening - adds computational cost to brute force attacks
   */
  strengthenKey(userKey: string, additionalRounds: number = 5000): string {
    let strengthenedKey = userKey
    for (let i = 0; i < additionalRounds; i++) {
      strengthenedKey = CryptoJS.SHA256(strengthenedKey).toString()
    }
    return strengthenedKey
  }
}

// Singleton instance
export const encryptionService = new EncryptionService()

/**
 * Utility functions for easier usage
 */

export const encryptSensitiveData = (data: any, userKey: string): EncryptionResult => {
  return encryptionService.encryptData(data, userKey)
}

export const decryptSensitiveData = (request: DecryptionRequest): any => {
  return encryptionService.decryptData(request)
}

export const generateUserKey = (password: string): string => {
  const salt = encryptionService.generateSalt()
  return encryptionService.generateKeyFromPassword(password, salt)
}

export const verifyDataIntegrity = (data: any, hash: string): boolean => {
  return encryptionService.verifyDataIntegrity(data, hash)
}

/**
 * Encryption middleware for automatic encryption/decryption
 */
export const withEncryption = <T extends { isEncrypted?: boolean }>(
  data: T,
  userKey: string,
  shouldEncrypt: boolean = true
): T => {
  if (!shouldEncrypt || data.isEncrypted) {
    return data
  }

  try {
    const encrypted = encryptionService.encryptData(data, userKey)
    return {
      ...data,
      isEncrypted: true,
      encryptedData: encrypted.encryptedData,
      iv: encrypted.iv,
      salt: encrypted.salt
    } as T
  } catch (error) {
    console.warn('Failed to encrypt data, storing unencrypted:', error)
    return data
  }
}

export const withDecryption = <T extends { isEncrypted?: boolean; encryptedData?: string; iv?: string; salt?: string }>(
  data: T,
  userKey: string
): T => {
  if (!data.isEncrypted || !data.encryptedData || !data.iv || !data.salt) {
    return data
  }

  try {
    const decrypted = encryptionService.decryptData({
      encryptedData: data.encryptedData,
      iv: data.iv,
      salt: data.salt,
      key: userKey
    })

    // Remove encryption metadata and return decrypted data
    const { isEncrypted, encryptedData, iv, salt, ...restData } = data
    return { ...restData, ...decrypted } as T
  } catch (error) {
    console.error('Failed to decrypt data:', error)
    throw new Error('Unable to decrypt sensitive data - invalid key')
  }
}
