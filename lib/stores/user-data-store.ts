/**
 * Zustand store for comprehensive user data management
 * Integrates with IndexedDB for persistence and encryption for sensitive data
 */

import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import {
  UserProfile,
  ColorPreferences,
  MusicMediaPreferences,
  PersonalityTraits,
  RelationshipDynamics,
  MentalHealthIndicators,
  TemporalPreferences,
  InteractionPatterns,
  EngagementMetrics,
  EmotionalStateIndicators,
  ImportantDates,
  SharedMemories,
  LocationBasedMemories,
  DataUpdateRequest,
  DataQueryRequest
} from '../types/data-models'
import { indexedDBService } from '../utils/indexeddb'
import { encryptionService } from '../utils/encryption'

// ==================== STORE STATE INTERFACES ====================

interface UserDataState {
  // User identification
  currentUserId: string | null
  userKey: string | null // For encryption/decryption
  isAuthenticated: boolean
  
  // User profile data
  userProfile: UserProfile | null
  colorPreferences: ColorPreferences | null
  musicMediaPreferences: MusicMediaPreferences | null
  personalityTraits: PersonalityTraits | null
  relationshipDynamics: RelationshipDynamics | null
  mentalHealthIndicators: MentalHealthIndicators | null
  temporalPreferences: TemporalPreferences | null
  
  // Behavioral data (arrays for historical tracking)
  interactionPatterns: InteractionPatterns[]
  engagementMetrics: EngagementMetrics[]
  emotionalStateIndicators: EmotionalStateIndicators[]
  
  // Memory data
  importantDates: ImportantDates[]
  sharedMemories: SharedMemories[]
  locationBasedMemories: LocationBasedMemories[]
  
  // Session data
  currentSessionId: string
  sessionStartTime: Date | null
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
  lastSyncTime: Date | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Privacy settings
  privacySettings: {
    encryptionEnabled: boolean
    shareWithPartner: boolean
    analyticsOptIn: boolean
    dataRetention: 'minimal' | 'standard' | 'extended'
  }
}

interface UserDataActions {
  // Authentication
  authenticateUser: (userId: string, userKey: string) => Promise<void>
  logout: () => Promise<void>
  
  // Profile management
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  loadUserProfile: (userId: string) => Promise<void>
  
  // Preference updates
  updateColorPreferences: (preferences: Partial<ColorPreferences>) => Promise<void>
  updateMusicMediaPreferences: (preferences: Partial<MusicMediaPreferences>) => Promise<void>
  updatePersonalityTraits: (traits: Partial<PersonalityTraits>) => Promise<void>
  updateRelationshipDynamics: (dynamics: Partial<RelationshipDynamics>) => Promise<void>
  updateMentalHealthIndicators: (indicators: Partial<MentalHealthIndicators>) => Promise<void>
  updateTemporalPreferences: (preferences: Partial<TemporalPreferences>) => Promise<void>
  
  // Behavioral data
  trackInteractionPattern: (pattern: Omit<InteractionPatterns, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  recordEngagementMetric: (metric: Omit<EngagementMetrics, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateEmotionalState: (state: Omit<EmotionalStateIndicators, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  
  // Memory management
  addImportantDate: (date: Omit<ImportantDates, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  addSharedMemory: (memory: Omit<SharedMemories, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  addLocationMemory: (memory: Omit<LocationBasedMemories, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  
  // Data queries
  queryData: (request: DataQueryRequest) => Promise<any[]>
  
  // Sync and persistence
  syncData: () => Promise<void>
  exportData: (includeEncrypted?: boolean) => Promise<any>
  importData: (data: any) => Promise<void>
  
  // Privacy and security
  updatePrivacySettings: (settings: Partial<UserDataState['privacySettings']>) => Promise<void>
  changeEncryptionKey: (newKey: string) => Promise<void>
  
  // Utility
  clearError: () => void
  setLoading: (loading: boolean) => void
  generateNewSessionId: () => void
}

type UserDataStore = UserDataState & UserDataActions

// ==================== STORE IMPLEMENTATION ====================

export const useUserDataStore = create<UserDataStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          // Initial state
          currentUserId: null,
          userKey: null,
          isAuthenticated: false,
          
          userProfile: null,
          colorPreferences: null,
          musicMediaPreferences: null,
          personalityTraits: null,
          relationshipDynamics: null,
          mentalHealthIndicators: null,
          temporalPreferences: null,
          
          interactionPatterns: [],
          engagementMetrics: [],
          emotionalStateIndicators: [],
          
          importantDates: [],
          sharedMemories: [],
          locationBasedMemories: [],
          
          currentSessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sessionStartTime: null,
          isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
          syncStatus: 'idle' as const,
          lastSyncTime: null,
          
          isLoading: false,
          error: null,
          
          privacySettings: {
            encryptionEnabled: true,
            shareWithPartner: false,
            analyticsOptIn: true,
            dataRetention: 'standard' as const
          },

          // ==================== ACTIONS ====================

          authenticateUser: async (userId: string, userKey: string) => {
            set((state) => ({
              ...state,
              isLoading: true,
              error: null
            }))

            try {
              // Verify user key by attempting to load encrypted data
              const profile = await indexedDBService.getUserProfile(userId, userKey)
              
              set((state) => ({
                ...state,
                currentUserId: userId,
                userKey: userKey,
                isAuthenticated: true,
                sessionStartTime: new Date(),
                userProfile: profile,
                isLoading: false
              }))

              // Load all user data
              await get().loadUserProfile(userId)
            } catch (error) {
              set((state) => ({
                ...state,
                error: 'Authentication failed - invalid credentials',
                isLoading: false
              }))
              throw error
            }
          },

          logout: async () => {
            set(() => ({
              currentUserId: null,
              userKey: null,
              isAuthenticated: false,
              userProfile: null,
              colorPreferences: null,
              musicMediaPreferences: null,
              personalityTraits: null,
              relationshipDynamics: null,
              mentalHealthIndicators: null,
              temporalPreferences: null,
              interactionPatterns: [],
              engagementMetrics: [],
              emotionalStateIndicators: [],
              importantDates: [],
              sharedMemories: [],
              locationBasedMemories: [],
              sessionStartTime: null,
              error: null,
              isLoading: false,
              currentSessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
              syncStatus: 'idle' as const,
              lastSyncTime: null,
              privacySettings: {
                encryptionEnabled: true,
                shareWithPartner: false,
                analyticsOptIn: true,
                dataRetention: 'standard' as const
              }
            }))
          },

          updateUserProfile: async (updates: Partial<UserProfile>) => {
            const { currentUserId, userKey, userProfile } = get()
            if (!currentUserId || !userProfile) throw new Error('User not authenticated')

            set((state) => ({
              ...state,
              isLoading: true
            }))

            try {
              const updatedProfile = {
                ...userProfile,
                ...updates,
                updatedAt: new Date()
              }

              await indexedDBService.saveUserProfile(updatedProfile, userKey || undefined)
              
              set((state) => ({
                ...state,
                userProfile: updatedProfile,
                isLoading: false
              }))
            } catch (error) {
              set((state) => ({
                ...state,
                error: 'Failed to update user profile',
                isLoading: false
              }))
              throw error
            }
          },

          loadUserProfile: async (userId: string) => {
            const { userKey } = get()
            
            try {
              const profile = await indexedDBService.getUserProfile(userId, userKey || undefined)
              if (profile) {
                set((state) => ({
                  ...state,
                  userProfile: profile,
                  colorPreferences: profile.colorPreferences,
                  musicMediaPreferences: profile.musicMediaPreferences,
                  personalityTraits: profile.personalityTraits,
                  relationshipDynamics: profile.relationshipDynamics,
                  mentalHealthIndicators: profile.mentalHealthIndicators,
                  temporalPreferences: profile.temporalPreferences,
                  interactionPatterns: profile.interactionPatterns || [],
                  engagementMetrics: profile.engagementMetrics || [],
                  emotionalStateIndicators: profile.emotionalStateIndicators || [],
                  importantDates: profile.importantDates || [],
                  sharedMemories: profile.sharedMemories || [],
                  locationBasedMemories: profile.locationBasedMemories || []
                }))
              }
            } catch (error) {
              set((state) => ({
                ...state,
                error: 'Failed to load user profile'
              }))
              throw error
            }
          },

          updateColorPreferences: async (preferences: Partial<ColorPreferences>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.colorPreferences,
              ...preferences,
              updatedAt: new Date()
            }

            await get().updateUserProfile({
              colorPreferences: updated as ColorPreferences
            })
          },

          updateMusicMediaPreferences: async (preferences: Partial<MusicMediaPreferences>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.musicMediaPreferences,
              ...preferences,
              updatedAt: new Date()
            }

            await get().updateUserProfile({
              musicMediaPreferences: updated as MusicMediaPreferences
            })
          },

          updatePersonalityTraits: async (traits: Partial<PersonalityTraits>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.personalityTraits,
              ...traits,
              updatedAt: new Date(),
              isEncrypted: true // Mark as needing encryption
            }

            await get().updateUserProfile({
              personalityTraits: updated as PersonalityTraits
            })
          },

          updateRelationshipDynamics: async (dynamics: Partial<RelationshipDynamics>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.relationshipDynamics,
              ...dynamics,
              updatedAt: new Date(),
              isEncrypted: true
            }

            await get().updateUserProfile({
              relationshipDynamics: updated as RelationshipDynamics
            })
          },

          updateMentalHealthIndicators: async (indicators: Partial<MentalHealthIndicators>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.mentalHealthIndicators,
              ...indicators,
              updatedAt: new Date(),
              isEncrypted: true
            }

            await get().updateUserProfile({
              mentalHealthIndicators: updated as MentalHealthIndicators
            })
          },

          updateTemporalPreferences: async (preferences: Partial<TemporalPreferences>) => {
            const { userProfile } = get()
            if (!userProfile) throw new Error('User profile not loaded')

            const updated = {
              ...userProfile.temporalPreferences,
              ...preferences,
              updatedAt: new Date()
            }

            await get().updateUserProfile({
              temporalPreferences: updated as TemporalPreferences
            })
          },

          trackInteractionPattern: async (pattern) => {
            const { currentSessionId, interactionPatterns } = get()
            
            const fullPattern: InteractionPatterns = {
              ...pattern,
              id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }

            await indexedDBService.saveBehavioralData('interaction', currentSessionId, fullPattern)
            
            set((state) => ({
              ...state,
              interactionPatterns: [...interactionPatterns, fullPattern]
            }))
          },

          recordEngagementMetric: async (metric) => {
            const { currentSessionId, engagementMetrics } = get()
            
            const fullMetric: EngagementMetrics = {
              ...metric,
              id: `engagement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }

            await indexedDBService.saveBehavioralData('engagement', currentSessionId, fullMetric)
            
            set((state) => ({
              ...state,
              engagementMetrics: [...engagementMetrics, fullMetric]
            }))
          },

          updateEmotionalState: async (emotionalState) => {
            const { currentSessionId, emotionalStateIndicators } = get()
            
            const fullState: EmotionalStateIndicators = {
              ...emotionalState,
              id: `emotional-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              isEncrypted: true
            }

            await indexedDBService.saveBehavioralData('emotional', currentSessionId, fullState)
            
            set((state) => ({
              ...state,
              emotionalStateIndicators: [...emotionalStateIndicators, fullState]
            }))
          },

          addImportantDate: async (date) => {
            const { importantDates } = get()
            
            const fullDate: ImportantDates = {
              ...date,
              id: `date-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }

            await indexedDBService.saveMemory('importantDates', fullDate)
            
            set((state) => ({
              ...state,
              importantDates: [...importantDates, fullDate]
            }))
          },

          addSharedMemory: async (memory) => {
            const { userKey, sharedMemories } = get()
            
            const fullMemory: SharedMemories = {
              ...memory,
              id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              isEncrypted: true
            }

            await indexedDBService.saveMemory('sharedMemories', fullMemory, userKey || undefined)
            
            set((state) => ({
              ...state,
              sharedMemories: [...sharedMemories, fullMemory]
            }))
          },

          addLocationMemory: async (memory) => {
            const { locationBasedMemories } = get()
            
            const fullMemory: LocationBasedMemories = {
              ...memory,
              id: `location-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }

            await indexedDBService.saveMemory('locationMemories', fullMemory)
            
            set((state) => ({
              ...state,
              locationBasedMemories: [...locationBasedMemories, fullMemory]
            }))
          },

          queryData: async (request: DataQueryRequest) => {
            const { userKey, currentSessionId } = get()
            
            switch (request.collection) {
              case 'interactionPatterns':
                return await indexedDBService.getBehavioralDataBySession(currentSessionId)
              case 'sharedMemories':
                return await indexedDBService.getMemories('sharedMemories', userKey || undefined, request.limit)
              case 'importantDates':
                return await indexedDBService.getMemories('importantDates', undefined, request.limit)
              default:
                throw new Error(`Query not implemented for collection: ${request.collection}`)
            }
          },

          syncData: async () => {
            set((state) => ({
              ...state,
              syncStatus: 'syncing' as const
            }))

            try {
              // Here you would implement cloud sync logic
              // For now, we'll just update the sync status
              set((state) => ({
                ...state,
                syncStatus: 'success' as const,
                lastSyncTime: new Date()
              }))
            } catch (error) {
              set((state) => ({
                ...state,
                syncStatus: 'error' as const,
                error: 'Sync failed'
              }))
              throw error
            }
          },

          exportData: async (includeEncrypted = false) => {
            return await indexedDBService.exportData(includeEncrypted)
          },

          importData: async (data: any) => {
            // Implementation for importing data
            set((state) => ({
              ...state,
              isLoading: true
            }))

            try {
              // Process and import data
              // This would include validation and merging logic
              set((state) => ({
                ...state,
                isLoading: false
              }))
            } catch (error) {
              set((state) => ({
                ...state,
                error: 'Failed to import data',
                isLoading: false
              }))
              throw error
            }
          },

          updatePrivacySettings: async (settings) => {
            const currentSettings = get().privacySettings
            const newSettings = { ...currentSettings, ...settings }
            
            set((state) => ({
              ...state,
              privacySettings: newSettings
            }))

            // Save to IndexedDB
            await indexedDBService.saveMetadata('privacySettings', newSettings)
          },

          changeEncryptionKey: async (newKey: string) => {
            const { currentUserId, userProfile } = get()
            if (!currentUserId || !userProfile) throw new Error('User not authenticated')

            set((state) => ({
              ...state,
              isLoading: true
            }))

            try {
              // This would involve decrypting with old key and re-encrypting with new key
              // For now, just update the key
              set((state) => ({
                ...state,
                userKey: newKey,
                isLoading: false
              }))
            } catch (error) {
              set((state) => ({
                ...state,
                error: 'Failed to change encryption key',
                isLoading: false
              }))
              throw error
            }
          },

          clearError: () => {
            set((state) => ({
              ...state,
              error: null
            }))
          },

          setLoading: (loading: boolean) => {
            set((state) => ({
              ...state,
              isLoading: loading
            }))
          },

          generateNewSessionId: () => {
            set((state) => ({
              ...state,
              currentSessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              sessionStartTime: new Date()
            }))
          }
        }),
        {
          name: 'user-data-storage',
          partialize: (state) => ({
            currentUserId: state.currentUserId,
            isAuthenticated: state.isAuthenticated,
            privacySettings: state.privacySettings,
            currentSessionId: state.currentSessionId
          })
        }
      )
    ),
    {
      name: 'user-data-store'
    }
  )
)

// ==================== SELECTORS ====================

export const useAuth = () => {
  return useUserDataStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    currentUserId: state.currentUserId,
    authenticateUser: state.authenticateUser,
    logout: state.logout
  }))
}

export const usePreferences = () => {
  return useUserDataStore((state) => ({
    colorPreferences: state.colorPreferences,
    musicMediaPreferences: state.musicMediaPreferences,
    temporalPreferences: state.temporalPreferences,
    updateColorPreferences: state.updateColorPreferences,
    updateMusicMediaPreferences: state.updateMusicMediaPreferences,
    updateTemporalPreferences: state.updateTemporalPreferences
  }))
}

export const useBehavioralTracking = () => {
  return useUserDataStore((state) => ({
    interactionPatterns: state.interactionPatterns,
    engagementMetrics: state.engagementMetrics,
    emotionalStateIndicators: state.emotionalStateIndicators,
    trackInteractionPattern: state.trackInteractionPattern,
    recordEngagementMetric: state.recordEngagementMetric,
    updateEmotionalState: state.updateEmotionalState
  }))
}

export const useMemories = () => {
  return useUserDataStore((state) => ({
    importantDates: state.importantDates,
    sharedMemories: state.sharedMemories,
    locationBasedMemories: state.locationBasedMemories,
    addImportantDate: state.addImportantDate,
    addSharedMemory: state.addSharedMemory,
    addLocationMemory: state.addLocationMemory
  }))
}

export const usePrivacy = () => {
  return useUserDataStore((state) => ({
    privacySettings: state.privacySettings,
    updatePrivacySettings: state.updatePrivacySettings,
    changeEncryptionKey: state.changeEncryptionKey
  }))
}
