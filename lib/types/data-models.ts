/**
 * Comprehensive Data Model for React PWA
 * User preferences, behavioral tracking, and memory/milestone schemas
 */

// ==================== CORE TYPES ====================

export interface TimestampedData {
  createdAt: Date
  updatedAt: Date
  id: string
}

export interface EncryptedData {
  isEncrypted: boolean
  encryptionKey?: string
}

// ==================== USER PREFERENCES ====================

export interface ColorPreferences extends TimestampedData {
  basePreferences: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundPreference: 'light' | 'dark' | 'auto' | 'high-contrast'
    colorTemperature: 'warm' | 'cool' | 'neutral'
  }
  timeOfDayVariations: {
    morning: {
      preferredColors: string[]
      brightness: number // 0-100
      contrast: number // 0-100
    }
    afternoon: {
      preferredColors: string[]
      brightness: number
      contrast: number
    }
    evening: {
      preferredColors: string[]
      brightness: number
      contrast: number
    }
    night: {
      preferredColors: string[]
      brightness: number
      contrast: number
    }
  }
  emotionalAssociations: Record<string, {
    emotion: 'calm' | 'excited' | 'focused' | 'relaxed' | 'energized' | 'comfort'
    colors: string[]
    intensity: number // 0-10
  }>
}

export interface MusicMediaPreferences extends TimestampedData {
  genres: {
    preferred: string[]
    disliked: string[]
    neutral: string[]
  }
  energyLevels: {
    low: {
      preferredGenres: string[]
      tempo: 'slow' | 'moderate'
      volume: number // 0-100
    }
    medium: {
      preferredGenres: string[]
      tempo: 'moderate' | 'upbeat'
      volume: number
    }
    high: {
      preferredGenres: string[]
      tempo: 'upbeat' | 'fast'
      volume: number
    }
  }
  emotionalContexts: Record<string, {
    context: 'stress-relief' | 'focus' | 'celebration' | 'comfort' | 'motivation'
    preferredGenres: string[]
    specificTracks?: string[]
    avoidedGenres: string[]
  }>
  mediaTypes: {
    music: boolean
    podcasts: boolean
    audiobooks: boolean
    ambientSounds: boolean
    whitenoise: boolean
  }
}

export interface PersonalityTraits extends TimestampedData, EncryptedData {
  tvShows: {
    favoriteGenres: string[]
    characterTypes: string[] // 'hero', 'antihero', 'comedian', 'intellectual', etc.
    plotPreferences: string[] // 'mystery', 'romance', 'action', 'slice-of-life', etc.
    viewingHabits: 'binge' | 'episodic' | 'background' | 'focused'
  }
  games: {
    preferredTypes: string[] // 'puzzle', 'strategy', 'action', 'simulation', etc.
    competitiveness: number // 0-10
    cooperativePreference: number // 0-10
    complexityPreference: 'simple' | 'moderate' | 'complex'
    timeCommitment: 'short' | 'medium' | 'long' | 'variable'
  }
  lifeExperiences: {
    riskTolerance: number // 0-10
    socialPreference: 'introverted' | 'extroverted' | 'ambivert'
    planningStyle: 'spontaneous' | 'planned' | 'flexible'
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
    stressResponse: 'fight' | 'flight' | 'freeze' | 'tend-befriend'
  }
  cognitivePatterns: {
    decisionMaking: 'analytical' | 'intuitive' | 'collaborative' | 'impulsive'
    informationProcessing: 'detail-oriented' | 'big-picture' | 'sequential' | 'random'
    motivationStyle: 'achievement' | 'affiliation' | 'autonomy' | 'mastery'
  }
}

export interface RelationshipDynamics extends TimestampedData, EncryptedData {
  partnerView: {
    primaryQualities: string[] // 'supportive', 'funny', 'intelligent', 'caring', etc.
    appreciatedBehaviors: string[]
    conflictAreas?: string[]
    strengthAreas: string[]
  }
  communicationStyle: {
    preferredMethods: ('verbal' | 'written' | 'physical-touch' | 'acts-of-service' | 'gifts')[]
    conflictResolution: 'direct' | 'indirect' | 'avoidant' | 'collaborative'
    emotionalExpression: 'open' | 'reserved' | 'selective' | 'demonstrative'
    listeningStyle: 'active' | 'solution-focused' | 'empathetic' | 'analytical'
  }
  intimacyPreferences: {
    emotionalIntimacy: number // 0-10
    physicalIntimacy: number // 0-10
    intellectualIntimacy: number // 0-10
    sharedActivities: string[]
    qualityTimeNeeds: number // hours per week
  }
  relationshipGoals: {
    shortTerm: string[]
    longTerm: string[]
    sharedValues: string[]
    growthAreas: string[]
  }
}

export interface MentalHealthIndicators extends TimestampedData, EncryptedData {
  anxietyPatterns: {
    triggers: string[]
    physicalSymptoms: string[]
    cognitivePatterns: string[]
    severity: number // 0-10
    frequency: 'daily' | 'weekly' | 'monthly' | 'situational'
  }
  comfortNeeds: {
    physicalComfort: string[] // 'soft textures', 'warm environments', 'quiet spaces'
    emotionalComfort: string[] // 'reassurance', 'routine', 'predictability'
    socialComfort: string[] // 'small groups', 'familiar people', 'alone time'
    sensoryComfort: string[] // 'dim lighting', 'minimal noise', 'specific scents'
  }
  copingPreferences: {
    healthyCoping: string[] // 'exercise', 'meditation', 'music', 'art'
    unhealthyCoping: string[] // tracked for awareness
    effectiveStrategies: Record<string, number> // strategy -> effectiveness rating
    situationalCoping: Record<string, string[]> // situation -> strategies
  }
  moodTracking: {
    currentMood: number // 0-10
    moodHistory: Array<{
      date: Date
      mood: number
      notes?: string
      triggers?: string[]
    }>
    patterns: {
      dailyPattern: Record<string, number> // time of day -> average mood
      weeklyPattern: Record<string, number> // day of week -> average mood
      monthlyTrends: Array<{ month: string; averageMood: number }>
    }
  }
}

export interface TemporalPreferences extends TimestampedData {
  timeOfDayPreferences: {
    mostProductiveTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'
    mostCreativeTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'
    socialTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'
    restTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'
  }
  mealPreferences: {
    mealTimes: {
      breakfast: string // "07:00"
      lunch: string
      dinner: string
      snacks: string[]
    }
    dietaryRestrictions: string[]
    favoriteFoods: string[]
    comfortFoods: string[]
    moodFoods: Record<string, string[]> // mood -> foods that help
  }
  routinePatterns: {
    morningRoutine: Array<{
      activity: string
      duration: number // minutes
      importance: number // 0-10
    }>
    eveningRoutine: Array<{
      activity: string
      duration: number
      importance: number
    }>
    weekendDifferences: {
      sleepSchedule: { wakeTime: string; bedTime: string }
      activityChanges: string[]
    }
    seasonalAdjustments: Record<string, {
      season: 'spring' | 'summer' | 'fall' | 'winter'
      adjustments: string[]
    }>
  }
}

// ==================== BEHAVIORAL TRACKING ====================

export interface InteractionPatterns extends TimestampedData {
  sessionData: {
    startTime: Date
    endTime: Date
    duration: number // milliseconds
    deviceType: 'mobile' | 'tablet' | 'desktop'
    interactionCount: number
  }
  swipeVelocity: {
    averageVelocity: number // pixels per millisecond
    patterns: Array<{
      direction: 'left' | 'right' | 'up' | 'down'
      velocity: number
      timestamp: Date
    }>
  }
  clickPatterns: {
    clickFrequency: number // clicks per minute
    dwellTime: number // average time before click
    precisionLevel: number // accuracy of clicks
    preferredTargetSizes: number[] // preferred button/target sizes
  }
  scrollBehavior: {
    scrollSpeed: number
    scrollPattern: 'steady' | 'erratic' | 'burst'
    readingPattern: 'skimming' | 'thorough' | 'selective'
  }
}

export interface EngagementMetrics extends TimestampedData {
  featureUsage: Record<string, {
    usageCount: number
    totalTime: number // milliseconds
    lastUsed: Date
    satisfaction: number // 0-10
  }>
  contentInteraction: {
    contentType: string
    engagementLevel: number // 0-10
    completionRate: number // 0-100
    shareRate: number // 0-100
    returnRate: number // 0-100
  }
  responsePatterns: {
    responseTime: number // average milliseconds
    accuracyRate: number // 0-100
    hesitationPatterns: Array<{
      questionType: string
      hesitationTime: number
    }>
  }
  satisfactionMetrics: {
    overallSatisfaction: number // 0-10
    usabilityScore: number // 0-10
    emotionalResponse: 'positive' | 'negative' | 'neutral'
    npsScore: number // -100 to 100
  }
}

export interface EmotionalStateIndicators extends TimestampedData, EncryptedData {
  derivedFromUsage: {
    stressLevel: number // 0-10, derived from interaction patterns
    focusLevel: number // 0-10, derived from session duration and accuracy
    energyLevel: number // 0-10, derived from interaction velocity
    moodIndicator: number // 0-10, derived from various factors
  }
  contextualFactors: {
    timeOfDay: string
    dayOfWeek: string
    weatherCondition?: string
    socialContext: 'alone' | 'with-partner' | 'with-friends' | 'family' | 'work'
    activityBefore: string
  }
  biometricIntegration?: {
    heartRate?: number
    sleepQuality?: number // 0-10
    activityLevel?: number // steps or activity units
  }
}

// ==================== MEMORY/MILESTONE SCHEMA ====================

export interface ImportantDates extends TimestampedData {
  date: Date
  title: string
  description: string
  significance: number // 0-10
  category: 'anniversary' | 'birthday' | 'achievement' | 'relationship' | 'personal' | 'family' | 'work'
  recurrence: 'none' | 'yearly' | 'monthly' | 'custom'
  reminder: {
    enabled: boolean
    daysInAdvance: number[]
    customMessage?: string
  }
  emotionalWeight: number // 0-10
  peopleInvolved: string[]
}

export interface SharedMemories extends TimestampedData, EncryptedData {
  title: string
  description: string
  date: Date
  location?: {
    name: string
    coordinates?: { latitude: number; longitude: number }
    address?: string
  }
  peopleInvolved: string[]
  emotionalTags: Array<{
    emotion: 'joy' | 'love' | 'excitement' | 'peace' | 'adventure' | 'comfort' | 'growth'
    intensity: number // 0-10
  }>
  mediaAttached: Array<{
    type: 'photo' | 'video' | 'audio' | 'document'
    url: string
    description?: string
  }>
  milestoneType: 'first' | 'achievement' | 'challenge-overcome' | 'growth' | 'celebration' | 'transition'
  privateNotes?: string
  sharedWithPartner: boolean
}

export interface LocationBasedMemories extends TimestampedData {
  location: {
    name: string
    coordinates: { latitude: number; longitude: number }
    address: string
    type: 'home' | 'restaurant' | 'travel' | 'work' | 'entertainment' | 'nature' | 'other'
  }
  memories: Array<{
    date: Date
    description: string
    emotionalValue: number // 0-10
    peopleWith: string[]
    activity: string
    notes?: string
  }>
  visitFrequency: {
    totalVisits: number
    lastVisit: Date
    averageStayDuration?: number // minutes
  }
  preferences: {
    favoriteAspects: string[]
    timeOfDayPreference: string[]
    seasonalPreference: string[]
    companionPreference: 'alone' | 'with-partner' | 'with-friends' | 'any'
  }
}

// ==================== AGGREGATE USER PROFILE ====================

export interface UserProfile extends TimestampedData, EncryptedData {
  userId: string
  colorPreferences: ColorPreferences
  musicMediaPreferences: MusicMediaPreferences
  personalityTraits: PersonalityTraits
  relationshipDynamics: RelationshipDynamics
  mentalHealthIndicators: MentalHealthIndicators
  temporalPreferences: TemporalPreferences
  
  // Behavioral data
  interactionPatterns: InteractionPatterns[]
  engagementMetrics: EngagementMetrics[]
  emotionalStateIndicators: EmotionalStateIndicators[]
  
  // Memory data
  importantDates: ImportantDates[]
  sharedMemories: SharedMemories[]
  locationBasedMemories: LocationBasedMemories[]
  
  // Metadata
  profileVersion: string
  dataIntegrityHash: string
  lastBackup?: Date
  privacySettings: {
    dataRetention: 'minimal' | 'standard' | 'extended'
    shareWithPartner: boolean
    analyticsOptIn: boolean
    encryptionLevel: 'basic' | 'enhanced'
  }
}

// ==================== API INTERFACES ====================

export interface DataUpdateRequest<T> {
  data: Partial<T>
  updateType: 'merge' | 'replace' | 'append'
  validateBeforeUpdate: boolean
}

export interface DataQueryRequest {
  collection: keyof UserProfile
  filters?: Record<string, any>
  sortBy?: string
  limit?: number
  offset?: number
  includeEncrypted?: boolean
}

export interface DataBackupRequest {
  includeEncrypted: boolean
  compressionLevel: 'none' | 'low' | 'high'
  destinationType: 'local' | 'cloud' | 'export'
}
