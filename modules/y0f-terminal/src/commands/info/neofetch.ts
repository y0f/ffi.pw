import { createCommand, CommandCategory } from '../../core/Command'
import { formatMultiPart, formatText, formatEmptyLine } from '../../core/formatters'

export const neofetch = createCommand({
  name: 'neofetch',
  description: 'Display system information',
  category: CommandCategory.INFO,
  usage: 'neofetch',

  execute: async () => {
    const getBrowserInfo = () => {
      const ua = navigator.userAgent
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Edg')) return 'Edge'
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Safari')) return 'Safari'
      return 'Unknown'
    }

    const getOS = () => {
      const ua = navigator.userAgent
      if (ua.includes('Win')) return 'Windows'
      if (ua.includes('Mac')) return 'macOS'
      if (ua.includes('Linux')) return 'Linux'
      if (ua.includes('Android')) return 'Android'
      if (ua.includes('iOS')) return 'iOS'
      return 'Unknown'
    }

    const getScreenResolution = () => {
      return `${window.screen.width}x${window.screen.height}`
    }

    const getLanguage = () => {
      return navigator.language || 'Unknown'
    }

    const getCPUCores = () => {
      return navigator.hardwareConcurrency || 'Unknown'
    }

    const getMemory = () => {
      const memory = (navigator as any).deviceMemory
      return memory ? `${memory} GB` : 'Unknown'
    }

    const ascii = [
      '    ███████╗███████╗██╗',
      '    ██╔════╝██╔════╝██║',
      '    █████╗  █████╗  ██║',
      '    ██╔══╝  ██╔══╝  ██║',
      '    ██║     ██║     ██║',
      '    ╚═╝     ╚═╝     ╚═╝',
    ]

    const info = [
      { label: 'OS', value: getOS() },
      { label: 'Browser', value: getBrowserInfo() },
      { label: 'Resolution', value: getScreenResolution() },
      { label: 'Language', value: getLanguage() },
      { label: 'CPU Cores', value: getCPUCores().toString() },
      { label: 'Memory', value: getMemory() },
      { label: 'Terminal', value: 'ffi.pw' },
    ]

    const output = [formatEmptyLine()]

    // Combine ASCII art with info
    ascii.forEach((line, index) => {
      const infoPart = info[index]
      if (infoPart) {
        output.push(
          formatMultiPart([
            { text: line, color: 'text-primary-400' },
            { text: '    ', color: 'text-white' },
            { text: `${infoPart.label}: `, color: 'text-primary-300' },
            { text: infoPart.value, color: 'text-gray-200' },
          ]),
        )
      } else {
        output.push(formatText(line, 'text-primary-400'))
      }
    })

    for (let i = ascii.length; i < info.length; i++) {
      const infoPart = info[i]
      if (infoPart) {
        output.push(
          formatMultiPart([
            { text: ' '.repeat(ascii[0]?.length || 0), color: 'text-white' },
            { text: '    ', color: 'text-white' },
            { text: `${infoPart.label}: `, color: 'text-primary-300' },
            { text: infoPart.value, color: 'text-gray-200' },
          ]),
        )
      }
    }

    output.push(formatEmptyLine())

    // Color palette - 8 theme colors in 500 value
    const colors = [
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-cyan-500',
      'text-blue-500',
      'text-purple-500',
      'text-pink-500',
    ]
    output.push(formatMultiPart(colors.map((color) => ({ text: '███ ', color }))))

    return output
  },
})
