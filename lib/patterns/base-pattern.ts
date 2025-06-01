/**
 * Abstract base class for all patterns in Pattern Prophet
 * Enforces neurodiversity-friendly design principles:
 * - Multiple valid solutions per pattern
 * - Micro-adaptive difficulty adjustment
 * - Frustration prevention mechanisms
 * - Predictable interaction patterns
 */

export interface PatternElement {
  id: string
  type: string
  properties: Record<string, any>
  position?: { x: number; y: number }
}

export interface PatternSolution {
  elements: PatternElement[]
  confidence: number // 0-1, allows partial credit
  reasoning?: string // For accessibility/explanation
}

export interface DifficultyMetrics {
  complexity: number // 1-10 scale
  cognitiveLoad: number // 1-10 scale
  timeToSolve: number // seconds
  errorRate: number // 0-1 scale
  frustrationLevel: number // 0-1 scale (detected from interaction patterns)
}

export interface PatternConfig {
  patternType: string
  difficulty: number // 1-10 scale
  elements: PatternElement[]
  validSolutions: PatternSolution[]
  hints: string[]
  maxAttempts?: number
  timeLimit?: number // seconds, optional
  accessibilityFeatures: {
    highContrast: boolean
    reducedMotion: boolean
    audioDescriptions: boolean
    keyboardNavigation: boolean
  }
}

export interface PatternAttempt {
  id: string
  timestamp: Date
  elements: PatternElement[]
  isCorrect: boolean
  confidence: number
  timeSpent: number // seconds
  hintsUsed: number
  interactionPattern: 'systematic' | 'random' | 'exploratory' | 'frustrated'
}

export interface PatternProgress {
  userId: string
  patternType: string
  currentDifficulty: number
  totalAttempts: number
  successfulAttempts: number
  averageTimeToSolve: number
  preferredStrategies: string[]
  lastPlayed: Date
  masteryLevel: number // 0-1 scale
}

/**
 * Base abstract class that all pattern types must extend
 * Contains core functionality for difficulty adaptation and accessibility
 */
export abstract class BasePattern {
  protected config: PatternConfig
  protected progress: PatternProgress
  protected currentAttempt?: PatternAttempt

  constructor(config: PatternConfig, progress: PatternProgress) {
    this.config = config
    this.progress = progress
  }

  /**
   * Generate a new pattern instance based on current difficulty
   * Must be implemented by each pattern type
   */
  abstract generate(): PatternConfig

  /**
   * Validate a user's solution attempt
   * Returns confidence score (0-1) to allow partial credit
   */
  abstract validateSolution(attempt: PatternElement[]): {
    isValid: boolean
    confidence: number
    feedback: string
    suggestions?: string[]
  }

  /**
   * Get contextual hints without revealing the solution
   * Hints adapt to user's current strategy and progress
   */
  abstract getHint(attemptHistory: PatternAttempt[]): string

  /**
   * Micro-adaptive difficulty adjustment
   * Analyzes recent performance and adjusts difficulty accordingly
   * Prevents frustration cliffs that can overwhelm autistic children
   */
  adaptDifficulty(recentAttempts: PatternAttempt[]): number {
    const frustrationThreshold = 0.7
    const successRate = this.calculateSuccessRate(recentAttempts)
    const avgFrustration = this.calculateFrustrationLevel(recentAttempts)
    
    // Emergency difficulty drop if frustration is too high
    if (avgFrustration > frustrationThreshold) {
      return Math.max(1, this.progress.currentDifficulty - 2)
    }
    
    // Gradual adjustment based on success rate
    if (successRate > 0.8 && avgFrustration < 0.3) {
      return Math.min(10, this.progress.currentDifficulty + 0.5)
    } else if (successRate < 0.4) {
      return Math.max(1, this.progress.currentDifficulty - 0.5)
    }
    
    return this.progress.currentDifficulty
  }

  /**
   * Detect user's current interaction pattern
   * Helps identify frustration early and adjust accordingly
   */
  detectInteractionPattern(attempts: PatternAttempt[]): 'systematic' | 'random' | 'exploratory' | 'frustrated' {
    if (attempts.length < 3) return 'exploratory'
    
    const recentAttempts = attempts.slice(-5)
    const avgTimePerAttempt = recentAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / recentAttempts.length
    const rapidFiring = avgTimePerAttempt < 2 // Less than 2 seconds per attempt
    const manyIncorrect = recentAttempts.filter(a => !a.isCorrect).length > 3
    
    if (rapidFiring && manyIncorrect) {
      return 'frustrated'
    }
    
    // Check for systematic approach (consistent element positioning/strategies)
    const hasConsistentStrategy = this.hasConsistentStrategy(recentAttempts)
    if (hasConsistentStrategy) {
      return 'systematic'
    }
    
    // Random if high variance in approach
    const hasHighVariance = this.hasHighVarianceInApproach(recentAttempts)
    if (hasHighVariance) {
      return 'random'
    }
    
    return 'exploratory'
  }

  /**
   * Calculate success rate from recent attempts
   */
  private calculateSuccessRate(attempts: PatternAttempt[]): number {
    if (attempts.length === 0) return 0.5 // Default middle ground
    const successfulAttempts = attempts.filter(a => a.isCorrect || a.confidence > 0.7).length
    return successfulAttempts / attempts.length
  }

  /**
   * Calculate average frustration level from interaction patterns
   */
  private calculateFrustrationLevel(attempts: PatternAttempt[]): number {
    if (attempts.length === 0) return 0
    
    let frustrationScore = 0
    attempts.forEach(attempt => {
      // Rapid attempts with low confidence indicate frustration
      if (attempt.timeSpent < 3 && attempt.confidence < 0.3) {
        frustrationScore += 0.3
      }
      // Many hints used indicates struggle
      if (attempt.hintsUsed > 2) {
        frustrationScore += 0.2
      }
      // Detect repetitive unsuccessful patterns
      if (!attempt.isCorrect && attempt.confidence < 0.1) {
        frustrationScore += 0.1
      }
    })
    
    return Math.min(1, frustrationScore / attempts.length)
  }

  /**
   * Check if user has a consistent strategy across attempts
   */
  private hasConsistentStrategy(attempts: PatternAttempt[]): boolean {
    // Implementation would analyze element placement patterns
    // For now, return false - to be implemented by specific pattern types
    return false
  }

  /**
   * Check if user has high variance in their approach
   */
  private hasHighVarianceInApproach(attempts: PatternAttempt[]): boolean {
    // Implementation would analyze variance in element selection/placement
    // For now, return false - to be implemented by specific pattern types
    return false
  }

  /**
   * Get current pattern configuration
   */
  getConfig(): PatternConfig {
    return this.config
  }

  /**
   * Get current progress data
   */
  getProgress(): PatternProgress {
    return this.progress
  }

  /**
   * Update progress after an attempt
   */
  updateProgress(attempt: PatternAttempt): void {
    this.progress.totalAttempts++
    if (attempt.isCorrect || attempt.confidence > 0.7) {
      this.progress.successfulAttempts++
    }
    
    this.progress.averageTimeToSolve = 
      (this.progress.averageTimeToSolve * (this.progress.totalAttempts - 1) + attempt.timeSpent) / 
      this.progress.totalAttempts
      
    this.progress.lastPlayed = new Date()
    
    // Update mastery level based on recent performance
    const recentSuccessRate = this.calculateSuccessRate([attempt])
    this.progress.masteryLevel = Math.min(1, 
      this.progress.masteryLevel * 0.9 + recentSuccessRate * 0.1
    )
  }
}
