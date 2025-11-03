import clsx from 'clsx'

export type ThemeClassFunction = (isDarkMode: boolean) => string

export interface ClassDefinition {
  base?: string
  dark?: string
  light?: string
}

export type ThemeClasses = string | ThemeClassFunction | ClassDefinition

export const themeClass = (
  isDarkMode: boolean,
  baseClasses?: string,
  darkClasses?: string,
  lightClasses?: string,
): string => {
  return clsx(baseClasses, isDarkMode ? darkClasses : lightClasses)
}

export const createThemeClassGenerator = (
  isDarkMode: boolean,
): ((baseClasses?: string, darkClasses?: string, lightClasses?: string) => string) => {
  return (baseClasses, darkClasses, lightClasses) =>
    themeClass(isDarkMode, baseClasses, darkClasses, lightClasses)
}

export const themePatterns = {
  text: {
    primary: (isDarkMode: boolean): string => (isDarkMode ? 'text-white' : 'text-gray-800'),
    secondary: (isDarkMode: boolean): string => (isDarkMode ? 'text-gray-200' : 'text-gray-600'),
    tertiary: (isDarkMode: boolean): string => (isDarkMode ? 'text-gray-400' : 'text-gray-500'),
    muted: (isDarkMode: boolean): string => (isDarkMode ? 'text-gray-500' : 'text-gray-400'),
  },

  bg: {
    primary: (isDarkMode: boolean): string => (isDarkMode ? 'bg-gray-950/70' : 'bg-white/90'),
    secondary: (isDarkMode: boolean): string => (isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/90'),
    card: (isDarkMode: boolean): string => (isDarkMode ? 'bg-gray-900/90' : 'bg-white/95'),
    cardHover: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:bg-gray-900/95' : 'hover:bg-white',
    transparent: (): string => 'bg-transparent',
  },

  border: {
    primary: (isDarkMode: boolean): string =>
      isDarkMode ? 'border-neutral-200/20' : 'border-gray-300/60',
    secondary: (isDarkMode: boolean): string =>
      isDarkMode ? 'border-neutral-200/15' : 'border-gray-300/40',
    subtle: (isDarkMode: boolean): string =>
      isDarkMode ? 'border-neutral-200/10' : 'border-gray-200/50',
    strong: (isDarkMode: boolean): string =>
      isDarkMode ? 'border-neutral-200/30' : 'border-gray-400/70',
  },

  shadow: {
    glow: (isDarkMode: boolean): string =>
      isDarkMode ? '[text-shadow:_0_0_6px_#fff]' : '[text-shadow:_0_0_6px_rgba(0,0,0,0.1)]',
    subtle: (isDarkMode: boolean): string =>
      isDarkMode ? '[text-shadow:_0_0_3px_#fff]' : '[text-shadow:_0_0_3px_rgba(0,0,0,0.2)]',
    none: (): string => '[text-shadow:_none]',
  },

  boxShadow: {
    card: (isDarkMode: boolean): string =>
      isDarkMode ? 'shadow-lg shadow-gray-950/50' : 'shadow-md shadow-gray-400/20',
    cardHover: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'hover:shadow-xl hover:shadow-gray-950/70'
        : 'hover:shadow-lg hover:shadow-gray-400/30',
    subtle: (isDarkMode: boolean): string =>
      isDarkMode ? 'shadow-md shadow-gray-950/30' : 'shadow-sm shadow-gray-300/20',
  },

  accent: {
    text: (isDarkMode: boolean): string => (isDarkMode ? 'text-primary-400' : 'text-primary-600'),
    textHover: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:text-primary-300' : 'hover:text-primary-700',
    textSubtle: (isDarkMode: boolean): string =>
      isDarkMode ? 'text-primary-400/70' : 'text-primary-600/70',
    bg: (isDarkMode: boolean): string => (isDarkMode ? 'bg-primary-400/5' : 'bg-primary-100/30'),
    bgHover: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:bg-primary-400/10' : 'hover:bg-primary-100/50',
    border: (isDarkMode: boolean): string =>
      isDarkMode ? 'border-primary-400/30' : 'border-primary-500/40',
    borderHover: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:border-primary-400/50' : 'hover:border-primary-500/60',
    underline: (isDarkMode: boolean): string =>
      isDarkMode ? 'after:bg-primary-400' : 'after:bg-primary-600',
  },

  gradient: {
    card: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'bg-linear-to-br from-gray-900/95 via-gray-900/90 to-gray-950/90'
        : 'bg-linear-to-br from-white/95 via-gray-50/90 to-gray-100/85',
    cardWithAccent: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'bg-linear-to-br from-gray-900/95 via-gray-900/90 to-gray-950/90'
        : 'bg-linear-to-br from-white/95 via-gray-50/95 to-white/90',
    header: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'bg-gradient-to-b from-gray-950/80 to-transparent'
        : 'bg-gradient-to-b from-white/60 to-transparent',
  },

  interactive: {
    hover: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/80',
    active: (isDarkMode: boolean): string =>
      isDarkMode ? 'active:bg-gray-700/50' : 'active:bg-gray-200/80',
    focus: (isDarkMode: boolean): string =>
      isDarkMode ? 'focus:ring-primary-400/30' : 'focus:ring-primary-500/40',
  },

  pattern: {
    dots: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]'
        : 'bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)]',
    dotsSubtle: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)]'
        : 'bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)]',
  },

  container: {
    main: (isDarkMode: boolean): string =>
      isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-300 text-gray-800',
  },

  backdrop: {
    blur: (isDarkMode: boolean): string => (isDarkMode ? 'bg-black/30' : 'bg-gray-800/30'),
  },

  scrollbar: {
    default: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-300'
        : 'scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500',
  },

  status: {
    available: (isDarkMode: boolean): string =>
      isDarkMode ? 'bg-primary-500 border-primary-400' : 'bg-primary-600 border-primary-500',
    unavailable: (isDarkMode: boolean): string =>
      isDarkMode ? 'bg-primary-300/40 border-primary-400' : 'bg-primary-200 border-primary-500',
    disabled: (isDarkMode: boolean): string =>
      isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-400 border-gray-500',
  },

  hover: {
    text: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-800',
    textInverse: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:text-white' : 'hover:text-gray-900',
    textShadow: (isDarkMode: boolean): string =>
      isDarkMode
        ? 'hover:[text-shadow:_0_0_15px_rgba(255,255,255,0.9)]'
        : 'hover:[text-shadow:_0_0_15px_rgba(0,0,0,0.5)]',
    underline: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:before:bg-white/30' : 'hover:before:bg-gray-900/20',
    underlineAccent: (isDarkMode: boolean): string =>
      isDarkMode ? 'hover:after:bg-primary-300' : 'hover:after:bg-primary-700',
  },
}

export const combineThemePatterns = (
  isDarkMode: boolean,
  baseClasses: string,
  ...patterns: ThemeClassFunction[]
): string => {
  const themeClasses = patterns
    .filter((pattern): pattern is ThemeClassFunction => typeof pattern === 'function')
    .map((pattern) => pattern(isDarkMode))
    .join(' ')
  return clsx(baseClasses, themeClasses)
}

export const createThemedClasses = (
  isDarkMode: boolean,
  classDefinitions: Record<string, ThemeClasses>,
): Record<string, string> => {
  return Object.entries(classDefinitions).reduce<Record<string, string>>(
    (acc, [key, definition]) => {
      if (typeof definition === 'function') {
        acc[key] = definition(isDarkMode)
      } else if (typeof definition === 'object' && 'base' in definition) {
        acc[key] = themeClass(isDarkMode, definition.base, definition.dark, definition.light)
      } else if (typeof definition === 'string') {
        acc[key] = definition
      }
      return acc
    },
    {},
  )
}
