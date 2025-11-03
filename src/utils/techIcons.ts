import { createElement, type ReactElement } from 'react'
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiVuedotjs,
  SiNextdotjs,
  SiTailwindcss,
  SiSass,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiPython,
  SiGo,
  SiFigma,
  SiLivewire,
  SiAlpinedotjs,
  SiMeilisearch,
  SiExpo,
  SiReactquery,
  SiApollographql,
  SiAxios,
  SiBurpsuite,
  SiOwasp,
} from 'react-icons/si'
import { PiLightbulbFilament } from 'react-icons/pi'
import { TbBrandReactNative } from 'react-icons/tb'
import { FaLaptopCode, FaMobileAlt, FaShieldAlt, FaCode } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import clsx from 'clsx'

export type TechLabel =
  | 'JavaScript (ES6+)'
  | 'TypeScript'
  | 'React'
  | 'Vue 3'
  | 'Next.js'
  | 'Tailwind CSS'
  | 'Sass'
  | 'Node.js'
  | 'Express'
  | 'PHP'
  | 'Laravel'
  | 'Laravel Filament'
  | 'Livewire'
  | 'MongoDB'
  | 'PostgreSQL'
  | 'Meilisearch'
  | 'MySQL'
  | 'Python'
  | 'Go (Golang)'
  | 'Alpine.js'
  | 'Figma'
  | 'Expo'
  | 'React Native'
  | 'React Query'
  | 'Apollo Client (GraphQL)'
  | 'Axios/Fetch'
  | 'Burp Suite'
  | 'OWASP ZAP'

const techIconMap: Array<[TechLabel, IconType]> = [
  ['JavaScript (ES6+)', SiJavascript],
  ['TypeScript', SiTypescript],
  ['React', SiReact],
  ['Vue 3', SiVuedotjs],
  ['Next.js', SiNextdotjs],
  ['Tailwind CSS', SiTailwindcss],
  ['Sass', SiSass],
  ['Node.js', SiNodedotjs],
  ['Express', SiExpress],
  ['PHP', SiPhp],
  ['Laravel', SiLaravel],
  ['Laravel Filament', PiLightbulbFilament],
  ['Livewire', SiLivewire],
  ['MongoDB', SiMongodb],
  ['PostgreSQL', SiPostgresql],
  ['Meilisearch', SiMeilisearch],
  ['MySQL', SiMysql],
  ['Python', SiPython],
  ['Go (Golang)', SiGo],
  ['Alpine.js', SiAlpinedotjs],
  ['Figma', SiFigma],
  ['Expo', SiExpo],
  ['React Native', TbBrandReactNative],
  ['React Query', SiReactquery],
  ['Apollo Client (GraphQL)', SiApollographql],
  ['Axios/Fetch', SiAxios],
  ['Burp Suite', SiBurpsuite],
  ['OWASP ZAP', SiOwasp],
]

export type TechIcons = Record<TechLabel | 'default', ReactElement>

/**
 * Creates a themed icon component
 */
function createIcon(IconComponent: IconType, isDarkMode: boolean): ReactElement {
  return createElement(IconComponent, {
    className: clsx(isDarkMode ? 'text-primary-200' : 'text-primary-500'),
  })
}

/**
 * Generates a complete set of technology icons with theme-aware coloring
 */
export function createTechIcons(isDarkMode: boolean): TechIcons {
  const icons = techIconMap.reduce<Partial<TechIcons>>((acc, [label, IconComponent]) => {
    acc[label] = createIcon(IconComponent, isDarkMode)
    return acc
  }, {})

  return {
    ...icons,
    default: createIcon(FaCode, isDarkMode),
  } as TechIcons
}

export type ServiceIconKey = 'web-development' | 'mobile-development' | 'web-security'

export const serviceIcons: Record<ServiceIconKey, ReactElement> = {
  'web-development': createElement(FaLaptopCode, { className: 'text-2xl' }),
  'mobile-development': createElement(FaMobileAlt, { className: 'text-2xl' }),
  'web-security': createElement(FaShieldAlt, { className: 'text-2xl' }),
}
