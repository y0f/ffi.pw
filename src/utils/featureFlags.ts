/**
 * Feature flags for y0f-terminal optimizations
 */

export interface FeatureFlags {
  useCssCustomProperties: boolean
  useOptimizedMotionValues: boolean
  useStaticClasses: boolean
  useCommandCodeSplitting: boolean
  useGameCodeSplitting: boolean
  useRafAnimations: boolean
  useOptimizedHooks: boolean
  useOutputWindowing: boolean
  useColorOverrideCache: boolean
  useVfsStructuralSharing: boolean
  useSplitTerminalComponent: boolean
  enablePerformanceMonitoring: boolean
  enableDebugLogging: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  useCssCustomProperties: true,
  useOptimizedMotionValues: true,
  useStaticClasses: true,
  useCommandCodeSplitting: true,
  useGameCodeSplitting: true,
  useRafAnimations: true,
  useOptimizedHooks: true,
  useOutputWindowing: true,
  useColorOverrideCache: true,
  useVfsStructuralSharing: true,
  useSplitTerminalComponent: false,
  enablePerformanceMonitoring: import.meta.env.DEV,
  enableDebugLogging: import.meta.env.DEV,
}

class FeatureFlagManager {
  private flags: FeatureFlags
  private listeners: Set<(flags: FeatureFlags) => void> = new Set()

  constructor() {
    // Load from localStorage if available
    this.flags = this.loadFlags()
  }

  private loadFlags(): FeatureFlags {
    if (typeof window === 'undefined') {
      return DEFAULT_FLAGS
    }

    try {
      const stored = localStorage.getItem('y0f-terminal-feature-flags')
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_FLAGS, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to load feature flags from localStorage:', e)
    }

    return DEFAULT_FLAGS
  }

  private saveFlags() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('y0f-terminal-feature-flags', JSON.stringify(this.flags))
    } catch (e) {
      console.warn('Failed to save feature flags to localStorage:', e)
    }
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature]
  }

  /**
   * Enable a feature flag
   */
  enable(feature: keyof FeatureFlags) {
    this.flags[feature] = true
    this.saveFlags()
    this.notifyListeners()

    if (this.flags.enableDebugLogging) {
      console.log(`✅ Feature enabled: ${feature}`)
    }
  }

  /**
   * Disable a feature flag
   */
  disable(feature: keyof FeatureFlags) {
    this.flags[feature] = false
    this.saveFlags()
    this.notifyListeners()

    if (this.flags.enableDebugLogging) {
      console.log(`❌ Feature disabled: ${feature}`)
    }
  }

  /**
   * Toggle a feature flag
   */
  toggle(feature: keyof FeatureFlags) {
    if (this.flags[feature]) {
      this.disable(feature)
    } else {
      this.enable(feature)
    }
  }

  /**
   * Get all flags
   */
  getAllFlags(): FeatureFlags {
    return { ...this.flags }
  }

  /**
   * Set multiple flags at once
   */
  setFlags(flags: Partial<FeatureFlags>) {
    this.flags = { ...this.flags, ...flags }
    this.saveFlags()
    this.notifyListeners()

    if (this.flags.enableDebugLogging) {
      console.log('🚩 Flags updated:', flags)
    }
  }

  /**
   * Reset all flags to defaults
   */
  reset() {
    this.flags = { ...DEFAULT_FLAGS }
    this.saveFlags()
    this.notifyListeners()

    if (this.flags.enableDebugLogging) {
      console.log('🔄 Flags reset to defaults')
    }
  }

  enablePhase1() {
    this.setFlags({
      useCssCustomProperties: true,
      useOptimizedMotionValues: true,
      useStaticClasses: true,
      useCommandCodeSplitting: true,
      useGameCodeSplitting: true,
      useRafAnimations: true,
      useOptimizedHooks: true,
    })
  }

  enablePhase2() {
    this.setFlags({
      useOutputWindowing: true,
      useColorOverrideCache: true,
      useVfsStructuralSharing: true,
    })
  }

  /**
   * Enable all optimizations
   */
  enableAll() {
    this.enablePhase1()
    this.enablePhase2()
    this.setFlags({
      useSplitTerminalComponent: true,
    })
  }

  /**
   * Disable all optimizations (rollback)
   */
  disableAll() {
    this.setFlags({
      useCssCustomProperties: false,
      useOptimizedMotionValues: false,
      useStaticClasses: false,
      useCommandCodeSplitting: false,
      useGameCodeSplitting: false,
      useRafAnimations: false,
      useOptimizedHooks: false,
      useOutputWindowing: false,
      useColorOverrideCache: false,
      useVfsStructuralSharing: false,
      useSplitTerminalComponent: false,
    })
  }

  /**
   * Subscribe to flag changes
   */
  subscribe(listener: (flags: FeatureFlags) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.flags))
  }

  /**
   * Log current flag status
   */
  logStatus() {
    console.group('🚩 Feature Flags Status')
    console.table(this.flags)
    console.groupEnd()
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagManager()

// Expose to window for easy debugging
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as any).featureFlags = featureFlags
  console.log(
    '💡 Feature flags available at window.featureFlags\n' +
      'Try: featureFlags.enablePhase1() or featureFlags.logStatus()',
  )
}

// Convenience functions
export const isFeatureEnabled = (feature: keyof FeatureFlags) => featureFlags.isEnabled(feature)
export const enableFeature = (feature: keyof FeatureFlags) => featureFlags.enable(feature)
export const disableFeature = (feature: keyof FeatureFlags) => featureFlags.disable(feature)
