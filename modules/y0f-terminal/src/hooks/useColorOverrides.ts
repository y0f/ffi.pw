import { DEFAULT_COLOR_OVERRIDES, type ColorOverride } from '../core/colorOverrides'
import type { OutputObject } from '../core/Command'

export interface ColorOverridesHook {
  applyColorOverrides: (items: OutputObject[], isDarkMode: boolean) => OutputObject[]
}

export default function useColorOverrides(customOverrides?: ColorOverride[]): ColorOverridesHook {
  const overrides = customOverrides || DEFAULT_COLOR_OVERRIDES

  const applyColorOverrides = (items: OutputObject[], isDarkMode: boolean): OutputObject[] => {
    if (!Array.isArray(items)) return items

    const overrideColorClass = (colorClass: string): string => {
      for (const override of overrides) {
        if (override.match.includes(colorClass)) {
          return isDarkMode ? colorClass : override.lightModeReplacement
        }
      }
      return colorClass
    }

    const processColorString = (colorString: string): string => {
      return colorString
        .split(' ')
        .map((c) => overrideColorClass(c))
        .join(' ')
    }

    return items.map((item) => {
      if (item.parts) {
        return {
          ...item,
          parts: item.parts.map((part) => ({
            ...part,
            color: processColorString(part.color || ''),
          })),
        }
      }

      return {
        ...item,
        color: processColorString(item.color || ''),
      }
    })
  }

  return { applyColorOverrides }
}
