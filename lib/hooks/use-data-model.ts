/**
 * Utility hooks demonstrating how to use the comprehensive data model
 * These hooks provide specific functionality and patterns for common use cases
 */

import { useCallback, useEffect, useMemo } from 'react'
import {
  useUserDataStore,
  useAuth,
  usePreferences,
  useBehavioralTracking,
  useMemories,
  usePrivacy
} from '../stores/user-data-store'
import { 
  ColorPreferences, 
  MusicMediaPreferences,
  InteractionPatterns,
  EmotionalStateIndicators 
} from '../types/data-models'

// ==================== AUTHENTICATION HOOKS ====================

/**
 * Hook for user authentication with comprehensive error handling
 */
export const useUserAuth = () => {
  const { isAuthenticated, currentUserId, authenticateUser, logout } = useAuth()
  const { isLoading, error, clearError } = useUserDataStore()

  const login = useCallback(async (userId: string, password: string) => {
    try {
      clearError()
      // In a real app, you'd derive the encryption key from the password
      const userKey = `key-${userId}-${password}` // Simplified for demo
      await authenticateUser(userId, userKey)
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }, [authenticateUser, clearError])

  const signOut = useCallback(async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }, [logout])

  return {
    isAuthenticated,
    currentUserId,
    isLoading,
    error,
    login,
    signOut,
    clearError
  }
}

// ==================== PREFERENCE MANAGEMENT HOOKS ====================

/**
 * Hook for managing color preferences with time-of-day adaptation
 */
export const useColorSystem = () => {
  const { colorPreferences, updateColorPreferences } = usePreferences()

  const getCurrentColors = useCallback(() => {
    if (!colorPreferences) return null

    const hour = new Date().getHours()
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'

    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening'
    else timeOfDay = 'night'

    return {
      base: colorPreferences.basePreferences,
      current: colorPreferences.timeOfDayVariations[timeOfDay],
      timeOfDay
    }
  }, [colorPreferences])

  const updateColorForEmotion = useCallback(async (
    emotion: string,
    colors: string[],
    intensity: number
  ) => {
    if (!colorPreferences) return

    const updatedAssociations = {
      ...colorPreferences.emotionalAssociations,
      [emotion]: { emotion: emotion as any, colors, intensity }
    }

    await updateColorPreferences({
      emotionalAssociations: updatedAssociations
    })
  }, [colorPreferences, updateColorPreferences])

  return {
    colorPreferences,
    getCurrentColors,
    updateColorForEmotion,
    updateColorPreferences
  }
}

/**
 * Hook for managing music preferences with contextual recommendations
 */
export const useMusicSystem = () => {
  const { musicMediaPreferences, updateMusicMediaPreferences } = usePreferences()

  const getRecommendationsForMood = useCallback((
    mood: 'stressed' | 'focused' | 'celebrating' | 'relaxed' | 'motivated'
  ) => {
    if (!musicMediaPreferences) return []

    const contextMap: Record<typeof mood, keyof typeof musicMediaPreferences.emotionalContexts> = {
      stressed: 'stress-relief',
      focused: 'focus',
      celebrating: 'celebration',
      relaxed: 'comfort',
      motivated: 'motivation'
    }

    const context = musicMediaPreferences.emotionalContexts[contextMap[mood]]
    return context?.preferredGenres || []
  }, [musicMediaPreferences])

  const updateMoodMusic = useCallback(async (
    mood: string,
    genres: string[],
    specificTracks?: string[]
  ) => {
    if (!musicMediaPreferences) return

    const updatedContexts = {
      ...musicMediaPreferences.emotionalContexts,
      [mood]: {
        context: mood as any,
        preferredGenres: genres,
        specificTracks,
        avoidedGenres: []
      }
    }

    await updateMusicMediaPreferences({
      emotionalContexts: updatedContexts
    })
  }, [musicMediaPreferences, updateMusicMediaPreferences])

  return {
    musicMediaPreferences,
    getRecommendationsForMood,
    updateMoodMusic,
    updateMusicMediaPreferences
  }
}

// ==================== BEHAVIORAL TRACKING HOOKS ====================

/**
 * Hook for real-time interaction tracking
 */
export const useInteractionTracker = () => {
  const { trackInteractionPattern, recordEngagementMetric } = useBehavioralTracking()
  const sessionStartTime = useUserDataStore((state) => state.sessionStartTime)

  const trackClick = useCallback(async (
    elementId: string,
    position: { x: number; y: number },
    dwellTime: number
  ) => {
    await trackInteractionPattern({
      sessionData: {
        startTime: sessionStartTime || new Date(),
        endTime: new Date(),
        duration: dwellTime,
        deviceType: 'desktop', // Could be detected
        interactionCount: 1
      },
      swipeVelocity: {
        averageVelocity: 0,
        patterns: []
      },
      clickPatterns: {
        clickFrequency: 1,
        dwellTime,
        precisionLevel: 1,
        preferredTargetSizes: []
      },
      scrollBehavior: {
        scrollSpeed: 0,
        scrollPattern: 'steady',
        readingPattern: 'thorough'
      }
    })
  }, [trackInteractionPattern, sessionStartTime])

  const trackFeatureUsage = useCallback(async (
    featureName: string,
    usageTime: number,
    satisfaction: number
  ) => {
    await recordEngagementMetric({
      featureUsage: {
        [featureName]: {
          usageCount: 1,
          totalTime: usageTime,
          lastUsed: new Date(),
          satisfaction
        }
      },
      contentInteraction: {
        contentType: featureName,
        engagementLevel: satisfaction,
        completionRate: 100,
        shareRate: 0,
        returnRate: 0
      },
      responsePatterns: {
        responseTime: usageTime,
        accuracyRate: 100,
        hesitationPatterns: []
      },
      satisfactionMetrics: {
        overallSatisfaction: satisfaction,
        usabilityScore: satisfaction,
        emotionalResponse: satisfaction > 7 ? 'positive' : satisfaction > 4 ? 'neutral' : 'negative',
        npsScore: (satisfaction - 5) * 20
      }
    })
  }, [recordEngagementMetric])

  return {
    trackClick,
    trackFeatureUsage
  }
}

/**
 * Hook for emotional state tracking and analysis
 */
export const useEmotionalTracking = () => {
  const { emotionalStateIndicators, updateEmotionalState } = useBehavioralTracking()

  const recordEmotionalState = useCallback(async (
    mood: number,
    stressLevel: number,
    energyLevel: number,
    context?: string
  ) => {
    const now = new Date()
    
    await updateEmotionalState({
      derivedFromUsage: {
        stressLevel,
        focusLevel: 10 - stressLevel, // Inverse relationship
        energyLevel,
        moodIndicator: mood
      },
      contextualFactors: {
        timeOfDay: now.toLocaleTimeString(),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        socialContext: 'alone', // Could be detected or user-input
        activityBefore: context || 'unknown'
      },
      isEncrypted: true
    })
  }, [updateEmotionalState])

  const getEmotionalTrends = useMemo(() => {
    if (!emotionalStateIndicators || emotionalStateIndicators.length === 0) {
      return { averageMood: 0, trends: [], recentStress: 0 }
    }

    const recent = emotionalStateIndicators.slice(-7) // Last 7 entries
    const averageMood = recent.reduce((sum, state) => 
      sum + state.derivedFromUsage.moodIndicator, 0) / recent.length
    
    const recentStress = recent.reduce((sum, state) => 
      sum + state.derivedFromUsage.stressLevel, 0) / recent.length

    const trends = recent.map(state => ({
      date: state.createdAt,
      mood: state.derivedFromUsage.moodIndicator,
      stress: state.derivedFromUsage.stressLevel,
      energy: state.derivedFromUsage.energyLevel
    }))

    return { averageMood, trends, recentStress }
  }, [emotionalStateIndicators])

  return {
    emotionalStateIndicators,
    recordEmotionalState,
    getEmotionalTrends
  }
}

// ==================== MEMORY MANAGEMENT HOOKS ====================

/**
 * Hook for managing shared memories and milestones
 */
export const useMemorySystem = () => {
  const { 
    importantDates, 
    sharedMemories, 
    locationBasedMemories,
    addImportantDate,
    addSharedMemory,
    addLocationMemory
  } = useMemories()

  const addMilestone = useCallback(async (
    title: string,
    description: string,
    date: Date,
    significance: number,
    category: 'anniversary' | 'birthday' | 'achievement' | 'relationship' | 'personal'
  ) => {
    await addImportantDate({
      date,
      title,
      description,
      significance,
      category,
      recurrence: category === 'birthday' || category === 'anniversary' ? 'yearly' : 'none',
      reminder: {
        enabled: true,
        daysInAdvance: [7, 1]
      },
      emotionalWeight: significance,
      peopleInvolved: []
    })
  }, [addImportantDate])

  const addMemory = useCallback(async (
    title: string,
    description: string,
    date: Date,
    emotions: Array<{ emotion: string; intensity: number }>,
    location?: { name: string; address: string }
  ) => {
    await addSharedMemory({
      title,
      description,
      date,
      location,
      peopleInvolved: [],
      emotionalTags: emotions.map(e => ({
        emotion: e.emotion as any,
        intensity: e.intensity
      })),
      mediaAttached: [],
      milestoneType: 'celebration',
      sharedWithPartner: false,
      isEncrypted: true
    })
  }, [addSharedMemory])

  const getUpcomingReminders = useMemo(() => {
    const now = new Date()
    const upcoming = importantDates
      .filter(date => date.reminder.enabled)
      .map(date => {
        const reminderDates = date.reminder.daysInAdvance.map(days => {
          const reminderDate = new Date(date.date)
          reminderDate.setDate(reminderDate.getDate() - days)
          return { date: reminderDate, daysInAdvance: days, event: date }
        })
        return reminderDates
      })
      .flat()
      .filter(reminder => reminder.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return upcoming.slice(0, 5) // Next 5 reminders
  }, [importantDates])

  return {
    importantDates,
    sharedMemories,
    locationBasedMemories,
    addMilestone,
    addMemory,
    getUpcomingReminders
  }
}

// ==================== PRIVACY AND SECURITY HOOKS ====================

/**
 * Hook for managing privacy settings and data encryption
 */
export const usePrivacyManager = () => {
  const { privacySettings, updatePrivacySettings, changeEncryptionKey } = usePrivacy()
  const { exportData } = useUserDataStore()

  const updateDataRetention = useCallback(async (
    retention: 'minimal' | 'standard' | 'extended'
  ) => {
    await updatePrivacySettings({ dataRetention: retention })
  }, [updatePrivacySettings])

  const togglePartnerSharing = useCallback(async () => {
    await updatePrivacySettings({ 
      shareWithPartner: !privacySettings.shareWithPartner 
    })
  }, [privacySettings.shareWithPartner, updatePrivacySettings])

  const exportUserData = useCallback(async (includeEncrypted: boolean = false) => {
    try {
      const data = await exportData(includeEncrypted)
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  }, [exportData])

  return {
    privacySettings,
    updateDataRetention,
    togglePartnerSharing,
    changeEncryptionKey,
    exportUserData
  }
}

// ==================== INTEGRATION HOOKS ====================

/**
 * Hook that provides a unified interface for common data operations
 */
export const useDataModel = () => {
  const auth = useUserAuth()
  const colors = useColorSystem()
  const music = useMusicSystem()
  const tracking = useInteractionTracker()
  const emotions = useEmotionalTracking()
  const memories = useMemorySystem()
  const privacy = usePrivacyManager()

  return {
    auth,
    colors,
    music,
    tracking,
    emotions,
    memories,
    privacy
  }
}
