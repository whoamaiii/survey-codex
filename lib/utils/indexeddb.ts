/**
 * IndexedDB utilities for offline data persistence
 * Provides robust data storage with versioning and migration support
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { UserProfile, TimestampedData } from '../types/data-models'
import { encryptionService } from './encryption'

// Database schema definition
interface UserDataDB extends DBSchema {
  userProfiles: {
    key: string // userId
    value: UserProfile
    indexes: {
      'by-updated': Date
      'by-created': Date
    }
  }
  preferences: {
    key: string
    value: TimestampedData & { type: string; data: any }
    indexes: {
      'by-type': string
      'by-updated': Date
    }
  }
  behavioralData: {
    key: string
    value: TimestampedData & { type: string; sessionId: string; data: any }
    indexes: {
      'by-type': string
      'by-session': string
      'by-date': Date
    }
  }
  memories: {
    key: string
    value: TimestampedData & { type: string; data: any }
    indexes: {
      'by-type': string
      'by-date': Date
      'by-significance': number
    }
  }
  metadata: {
    key: string
    value: {
      key: string
      value: any
      updatedAt: Date
    }
  }
}

class IndexedDBService {
  private db: IDBPDatabase<UserDataDB> | null = null
  private readonly dbName = 'UserDataDB'
  private readonly dbVersion = 1

  /**
   * Initialize the database connection
   */
  async init(): Promise<void> {
    try {
      this.db = await openDB<UserDataDB>(this.dbName, this.dbVersion, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`)
          
          // Create object stores and indexes
          if (!db.objectStoreNames.contains('userProfiles')) {
            const userProfileStore = db.createObjectStore('userProfiles', { keyPath: 'userId' })
            userProfileStore.createIndex('by-updated', 'updatedAt')
            userProfileStore.createIndex('by-created', 'createdAt')
          }

          if (!db.objectStoreNames.contains('preferences')) {
            const prefStore = db.createObjectStore('preferences', { keyPath: 'id' })
            prefStore.createIndex('by-type', 'type')
            prefStore.createIndex('by-updated', 'updatedAt')
          }

          if (!db.objectStoreNames.contains('behavioralData')) {
            const behavioralStore = db.createObjectStore('behavioralData', { keyPath: 'id' })
            behavioralStore.createIndex('by-type', 'type')
            behavioralStore.createIndex('by-session', 'sessionId')
            behavioralStore.createIndex('by-date', 'createdAt')
          }

          if (!db.objectStoreNames.contains('memories')) {
            const memoryStore = db.createObjectStore('memories', { keyPath: 'id' })
            memoryStore.createIndex('by-type', 'type')
            memoryStore.createIndex('by-date', 'createdAt')
            memoryStore.createIndex('by-significance', 'data.significance')
          }

          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata', { keyPath: 'key' })
          }
        },
        blocked() {
          console.warn('Database upgrade blocked by another connection')
        },
        blocking() {
          console.warn('This connection is blocking a database upgrade')
        }
      })
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error)
      throw new Error('Database initialization failed')
    }
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInit(): Promise<IDBPDatabase<UserDataDB>> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  /**
   * Store or update a user profile
   */
  async saveUserProfile(profile: UserProfile, userKey?: string): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      // Encrypt sensitive data if user key is provided
      let processedProfile = { ...profile }
      if (userKey) {
        processedProfile = this.encryptSensitiveFields(profile, userKey)
      }
      
      // Generate data integrity hash
      processedProfile.dataIntegrityHash = encryptionService.generateDataHash(processedProfile)
      processedProfile.updatedAt = new Date()
      
      await db.put('userProfiles', processedProfile)
    } catch (error) {
      console.error('Failed to save user profile:', error)
      throw new Error('Failed to save user profile')
    }
  }

  /**
   * Retrieve a user profile
   */
  async getUserProfile(userId: string, userKey?: string): Promise<UserProfile | null> {
    const db = await this.ensureInit()
    
    try {
      const profile = await db.get('userProfiles', userId)
      if (!profile) return null
      
      // Verify data integrity
      const { dataIntegrityHash, ...profileData } = profile
      const calculatedHash = encryptionService.generateDataHash(profileData)
      if (dataIntegrityHash !== calculatedHash) {
        console.warn('Data integrity check failed for user profile')
      }
      
      // Decrypt sensitive data if user key is provided
      if (userKey) {
        return this.decryptSensitiveFields(profile, userKey)
      }
      
      return profile
    } catch (error) {
      console.error('Failed to retrieve user profile:', error)
      throw new Error('Failed to retrieve user profile')
    }
  }

  /**
   * Store preference data
   */
  async savePreference(type: string, data: any, userId: string): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      const preferenceRecord = {
        id: `${userId}-${type}-${Date.now()}`,
        type,
        data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.put('preferences', preferenceRecord)
    } catch (error) {
      console.error('Failed to save preference:', error)
      throw new Error('Failed to save preference')
    }
  }

  /**
   * Retrieve preferences by type
   */
  async getPreferences(type: string, limit: number = 100): Promise<any[]> {
    const db = await this.ensureInit()
    
    try {
      const tx = db.transaction('preferences', 'readonly')
      const index = tx.store.index('by-type')
      const results = await index.getAll(type, limit)
      return results.map(r => r.data)
    } catch (error) {
      console.error('Failed to retrieve preferences:', error)
      throw new Error('Failed to retrieve preferences')
    }
  }

  /**
   * Store behavioral data
   */
  async saveBehavioralData(type: string, sessionId: string, data: any): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      const behavioralRecord = {
        id: `${sessionId}-${type}-${Date.now()}`,
        type,
        sessionId,
        data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.put('behavioralData', behavioralRecord)
    } catch (error) {
      console.error('Failed to save behavioral data:', error)
      throw new Error('Failed to save behavioral data')
    }
  }

  /**
   * Retrieve behavioral data by session
   */
  async getBehavioralDataBySession(sessionId: string): Promise<any[]> {
    const db = await this.ensureInit()
    
    try {
      const tx = db.transaction('behavioralData', 'readonly')
      const index = tx.store.index('by-session')
      const results = await index.getAll(sessionId)
      return results.map(r => ({ type: r.type, data: r.data, createdAt: r.createdAt }))
    } catch (error) {
      console.error('Failed to retrieve behavioral data:', error)
      throw new Error('Failed to retrieve behavioral data')
    }
  }

  /**
   * Store memory data
   */
  async saveMemory(type: string, data: any, userKey?: string): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      let processedData = data
      if (userKey && this.isSensitiveMemoryType(type)) {
        processedData = encryptionService.encryptData(data, userKey)
      }
      
      const memoryRecord = {
        id: `${type}-${Date.now()}`,
        type,
        data: processedData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.put('memories', memoryRecord)
    } catch (error) {
      console.error('Failed to save memory:', error)
      throw new Error('Failed to save memory')
    }
  }

  /**
   * Retrieve memories by type
   */
  async getMemories(type: string, userKey?: string, limit: number = 100): Promise<any[]> {
    const db = await this.ensureInit()
    
    try {
      const tx = db.transaction('memories', 'readonly')
      const index = tx.store.index('by-type')
      const results = await index.getAll(type, limit)
      
      return results.map(record => {
        let data = record.data
        if (userKey && this.isSensitiveMemoryType(type)) {
          try {
            data = encryptionService.decryptData({
              ...data,
              key: userKey
            })
          } catch (error) {
            console.warn('Failed to decrypt memory data:', error)
          }
        }
        return { ...data, id: record.id, createdAt: record.createdAt }
      })
    } catch (error) {
      console.error('Failed to retrieve memories:', error)
      throw new Error('Failed to retrieve memories')
    }
  }

  /**
   * Store metadata
   */
  async saveMetadata(key: string, value: any): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      await db.put('metadata', {
        key,
        value,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Failed to save metadata:', error)
      throw new Error('Failed to save metadata')
    }
  }

  /**
   * Retrieve metadata
   */
  async getMetadata(key: string): Promise<any> {
    const db = await this.ensureInit()
    
    try {
      const result = await db.get('metadata', key)
      return result?.value || null
    } catch (error) {
      console.error('Failed to retrieve metadata:', error)
      throw new Error('Failed to retrieve metadata')
    }
  }

  /**
   * Clear all data (for logout/reset)
   */
  async clearAllData(): Promise<void> {
    const db = await this.ensureInit()
    
    try {
      const tx = db.transaction(['userProfiles', 'preferences', 'behavioralData', 'memories', 'metadata'], 'readwrite')
      await Promise.all([
        tx.objectStore('userProfiles').clear(),
        tx.objectStore('preferences').clear(),
        tx.objectStore('behavioralData').clear(),
        tx.objectStore('memories').clear(),
        tx.objectStore('metadata').clear()
      ])
    } catch (error) {
      console.error('Failed to clear data:', error)
      throw new Error('Failed to clear data')
    }
  }

  /**
   * Export data for backup
   */
  async exportData(includeEncrypted: boolean = false): Promise<any> {
    const db = await this.ensureInit()
    
    try {
      const [profiles, preferences, behavioral, memories, metadata] = await Promise.all([
        db.getAll('userProfiles'),
        db.getAll('preferences'),
        db.getAll('behavioralData'),
        db.getAll('memories'),
        db.getAll('metadata')
      ])
      
      return {
        exportDate: new Date().toISOString(),
        version: this.dbVersion,
        data: {
          userProfiles: profiles,
          preferences,
          behavioralData: behavioral,
          memories: includeEncrypted ? memories : memories.filter(m => !this.isSensitiveMemoryType(m.type)),
          metadata
        }
      }
    } catch (error) {
      console.error('Failed to export data:', error)
      throw new Error('Failed to export data')
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    const db = await this.ensureInit()
    
    try {
      const [profileCount, prefCount, behavioralCount, memoryCount] = await Promise.all([
        db.count('userProfiles'),
        db.count('preferences'),
        db.count('behavioralData'),
        db.count('memories')
      ])
      
      return {
        userProfiles: profileCount,
        preferences: prefCount,
        behavioralData: behavioralCount,
        memories: memoryCount,
        totalRecords: profileCount + prefCount + behavioralCount + memoryCount
      }
    } catch (error) {
      console.error('Failed to get database stats:', error)
      throw new Error('Failed to get database stats')
    }
  }

  /**
   * Helper method to encrypt sensitive fields in user profile
   */
  private encryptSensitiveFields(profile: UserProfile, userKey: string): UserProfile {
    const sensitiveFields = ['personalityTraits', 'relationshipDynamics', 'mentalHealthIndicators']
    const processedProfile = { ...profile }
    
    sensitiveFields.forEach(field => {
      if (processedProfile[field as keyof UserProfile]) {
        try {
          const encrypted = encryptionService.encryptData(processedProfile[field as keyof UserProfile], userKey)
          ;(processedProfile as any)[field] = {
            isEncrypted: true,
            ...encrypted
          }
        } catch (error) {
          console.warn(`Failed to encrypt ${field}:`, error)
        }
      }
    })
    
    return processedProfile
  }

  /**
   * Helper method to decrypt sensitive fields in user profile
   */
  private decryptSensitiveFields(profile: UserProfile, userKey: string): UserProfile {
    const sensitiveFields = ['personalityTraits', 'relationshipDynamics', 'mentalHealthIndicators']
    const processedProfile = { ...profile }
    
    sensitiveFields.forEach(field => {
      const fieldData = (processedProfile as any)[field]
      if (fieldData?.isEncrypted) {
        try {
          const decrypted = encryptionService.decryptData({
            encryptedData: fieldData.encryptedData,
            iv: fieldData.iv,
            salt: fieldData.salt,
            key: userKey
          })
          ;(processedProfile as any)[field] = decrypted
        } catch (error) {
          console.warn(`Failed to decrypt ${field}:`, error)
        }
      }
    })
    
    return processedProfile
  }

  /**
   * Check if memory type contains sensitive data
   */
  private isSensitiveMemoryType(type: string): boolean {
    const sensitiveTypes = ['sharedMemories', 'relationshipMemories', 'personalReflections']
    return sensitiveTypes.includes(type)
  }
}

// Singleton instance
export const indexedDBService = new IndexedDBService()

// Initialize on import
indexedDBService.init().catch(error => {
  console.error('Failed to initialize IndexedDB service:', error)
})
