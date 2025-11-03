export type DeviceTier = 'mobile' | 'tablet' | 'desktop'

export type FramerMotionMode = 'reduced' | 'full'

export interface Breakpoints {
  mobile: number
  tablet: number
  desktop: number
}

export interface BackgroundFeatures {
  particles: Record<DeviceTier, boolean>
  tokyoGlow: Record<DeviceTier, boolean>
  texture: Record<DeviceTier, boolean>
  grid: Record<DeviceTier, boolean>
  floatingElements: Record<DeviceTier, boolean>
}

export interface AnimationFeatures {
  reduceMotion: Record<DeviceTier, boolean>
  continuousAnimations: Record<DeviceTier, boolean>
  framerMotion: Record<DeviceTier, FramerMotionMode>
}

export interface MonitoringConfig {
  enabled: boolean
  logThreshold: number
}

export interface PerformanceFeatures {
  background: BackgroundFeatures
  animations: AnimationFeatures
  monitoring: MonitoringConfig
}

export const BREAKPOINTS: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
}

export const PERFORMANCE_FEATURES: PerformanceFeatures = {
  background: {
    particles: {
      mobile: false,
      tablet: true,
      desktop: true,
    },
    tokyoGlow: {
      mobile: false,
      tablet: true,
      desktop: true,
    },
    texture: {
      mobile: false,
      tablet: true,
      desktop: true,
    },
    grid: {
      mobile: true,
      tablet: true,
      desktop: true,
    },
    floatingElements: {
      mobile: false,
      tablet: true,
      desktop: true,
    },
  },
  animations: {
    reduceMotion: {
      mobile: true,
      tablet: true,
      desktop: true,
    },
    continuousAnimations: {
      mobile: false,
      tablet: true,
      desktop: true,
    },
    framerMotion: {
      mobile: 'reduced',
      tablet: 'full',
      desktop: 'full',
    },
  },
  monitoring: {
    enabled: import.meta.env.DEV,
    logThreshold: 16.67,
  },
}

export const getDeviceTier = (width: number): DeviceTier => {
  if (width < BREAKPOINTS.mobile) return 'mobile'
  if (width < BREAKPOINTS.desktop) return 'tablet'
  return 'desktop'
}

export const isFeatureEnabled = (
  category: keyof PerformanceFeatures,
  feature: string,
  deviceTier: DeviceTier,
): boolean => {
  try {
    const categoryFeatures = PERFORMANCE_FEATURES[category]
    if (!categoryFeatures || typeof categoryFeatures !== 'object') return true

    // MonitoringConfig doesn't have device-specific settings, always return true for it
    if (category === 'monitoring') return true

    // Type guard for background and animations features
    const features = categoryFeatures as BackgroundFeatures | AnimationFeatures
    const featureConfig = (features as unknown as Record<string, unknown>)[feature] as
      | Record<string, unknown>
      | undefined
    if (!featureConfig || typeof featureConfig !== 'object') return true

    return (featureConfig as Record<DeviceTier, boolean | FramerMotionMode>)[deviceTier] !== false
  } catch {
    return true
  }
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const getOptimizedBlur = (desktopBlur: number, deviceTier: DeviceTier): number => {
  const BLUR_MULTIPLIERS: Record<DeviceTier, number> = {
    mobile: 0,
    tablet: 0.5,
    desktop: 1,
  }
  return Math.floor(desktopBlur * (BLUR_MULTIPLIERS[deviceTier] ?? 1))
}

export const getOptimizedParticleCount = (desktopCount: number, deviceTier: DeviceTier): number => {
  const PARTICLE_MULTIPLIERS: Record<DeviceTier, number> = {
    mobile: 0,
    tablet: 0.5,
    desktop: 1,
  }
  return Math.floor(desktopCount * (PARTICLE_MULTIPLIERS[deviceTier] ?? 1))
}
