import { useMemo } from 'react'
import useIsMobile from './useIsMobile'
import {
  BREAKPOINTS,
  getDeviceTier,
  isFeatureEnabled,
  prefersReducedMotion,
  DeviceTier,
  PerformanceFeatures,
} from '../utils/performance'

export interface DeviceCapability {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  deviceTier: DeviceTier
  shouldReduceMotion: boolean
  isFeatureEnabled: (category: keyof PerformanceFeatures, feature: string) => boolean
  canRender: (category: keyof PerformanceFeatures, feature: string) => boolean
}

export default function useDeviceCapability(): DeviceCapability {
  const isMobileSize = useIsMobile(BREAKPOINTS.mobile)
  const isTabletSize = useIsMobile(BREAKPOINTS.desktop)

  const deviceInfo = useMemo<DeviceCapability>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.desktop
    const tier = getDeviceTier(width)
    const shouldReduceMotion = prefersReducedMotion()

    return {
      isMobile: isMobileSize,
      isTablet: !isMobileSize && isTabletSize,
      isDesktop: !isTabletSize,
      deviceTier: tier,
      shouldReduceMotion,
      isFeatureEnabled: (category: keyof PerformanceFeatures, feature: string): boolean => {
        const enabled = isFeatureEnabled(category, feature, tier)
        if (category === 'animations' && shouldReduceMotion) {
          return false
        }
        return enabled
      },
      canRender: (category: keyof PerformanceFeatures, feature: string): boolean => {
        return isFeatureEnabled(category, feature, tier)
      },
    }
  }, [isMobileSize, isTabletSize])

  return deviceInfo
}
