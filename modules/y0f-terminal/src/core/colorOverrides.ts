export interface ColorOverride {
  match: string[]
  lightModeReplacement: string
}

export const DEFAULT_COLOR_OVERRIDES: ColorOverride[] = [
  {
    match: ['text-gray-200', 'text-white/20', 'text-white', 'text-gray-400'],
    lightModeReplacement: 'text-black',
  },
  {
    match: ['text-primary-400'],
    lightModeReplacement: 'text-primary-600 fira',
  },
  {
    match: ['text-red-500'],
    lightModeReplacement: 'text-red-600',
  },
  {
    match: ['text-red-400'],
    lightModeReplacement: 'text-red-500',
  },
  {
    match: ['text-orange-400'],
    lightModeReplacement: 'text-orange-600',
  },
]
