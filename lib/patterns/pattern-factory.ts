/**
 * Pattern Factory for Pattern Prophet
 * Creates and manages different pattern types
 * Implements the Factory pattern for extensible pattern generation
 */

import { BasePattern, PatternConfig, PatternProgress } from './base-pattern'
import { VisualSequencePattern } from './visual-sequence-pattern'

export type PatternType = 'visual-sequence' | 'number' | 'musical' | 'spatial' | 'rule-based'

export class PatternFactory {
  /**
   * Create a pattern instance based on type and configuration
   */
  static createPattern(
    type: PatternType,
    config: PatternConfig,
    progress: PatternProgress
  ): BasePattern {
    switch (type) {
      case 'visual-sequence':
        return new VisualSequencePattern(config, progress)
      case 'number':
        // TODO: Implement NumberPattern
        throw new Error('NumberPattern not yet implemented')
      case 'musical':
        // TODO: Implement MusicalPattern
        throw new Error('MusicalPattern not yet implemented')
      case 'spatial':
        // TODO: Implement SpatialRotationPattern
        throw new Error('SpatialRotationPattern not yet implemented')
      case 'rule-based':
        // TODO: Implement RuleBasedPattern
        throw new Error('RuleBasedPattern not yet implemented')
      default:
        throw new Error(`Unknown pattern type: ${type}`)
    }
  }

  /**
   * Get default configuration for a pattern type
   */
  static getDefaultConfig(type: PatternType, difficulty: number = 3): PatternConfig {
    return {
      patternType: type,
      difficulty,
      elements: [],
      validSolutions: [],
      hints: [],
      accessibilityFeatures: {
        highContrast: true,
        reducedMotion: true,
        audioDescriptions: true,
        keyboardNavigation: true
      }
    }
  }

  /**
   * Get default progress for a new user
   */
  static getDefaultProgress(userId: string, patternType: PatternType): PatternProgress {
    return {
      userId,
      patternType,
      currentDifficulty: 1,
      totalAttempts: 0,
      successfulAttempts: 0,
      averageTimeToSolve: 0,
      preferredStrategies: [],
      lastPlayed: new Date(),
      masteryLevel: 0
    }
  }
}
