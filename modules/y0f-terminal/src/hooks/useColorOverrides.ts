import { useMemo, useCallback } from 'react'
import { DEFAULT_COLOR_OVERRIDES, type ColorOverride } from '../core/colorOverrides'
import type { OutputObject } from '../core/Command'

export interface ColorOverridesHook {
  applyColorOverrides: (items: OutputObject[], isDarkMode: boolean) => OutputObject[]
}

export default function useColorOverrides(customOverrides?: ColorOverride[]): ColorOverridesHook {
  const overrides = customOverrides || DEFAULT_COLOR_OVERRIDES
  const colorCache = useMemo(() => new Map<string, Map<boolean, string>>(), [])

  const overrideColorClass = useCallback(
    (colorClass: string, isDarkMode: boolean): string => {
      if (!colorCache.has(colorClass)) {
        colorCache.set(colorClass, new Map())
      }
      const modeCache = colorCache.get(colorClass)!
      if (modeCache.has(isDarkMode)) {
        return modeCache.get(isDarkMode)!
      }

      let result = colorClass
      for (const override of overrides) {
        if (override.match.includes(colorClass)) {
          result = isDarkMode ? colorClass : override.lightModeReplacement
          break
        }
      }

      colorCache.get(colorClass)!.set(isDarkMode, result)
      return result
    },
    [overrides, colorCache],
  )

  const processColorString = useCallback(
    (colorString: string, isDarkMode: boolean): string => {
      return colorString
        .split(' ')
        .map((c) => overrideColorClass(c, isDarkMode))
        .join(' ')
    },
    [overrideColorClass],
  )

  const applyColorOverrides = useCallback(
    (items: OutputObject[], isDarkMode: boolean): OutputObject[] => {
      if (!Array.isArray(items)) return items

      return items.map((item) => {
        if (item.parts) {
          return {
            ...item,
            parts: item.parts.map((part) => ({
              ...part,
              color: processColorString(part.color || '', isDarkMode),
            })),
          }
        }

        return {
          ...item,
          color: processColorString(item.color || '', isDarkMode),
        }
      })
    },
    [processColorString],
  )

  return { applyColorOverrides }
}
