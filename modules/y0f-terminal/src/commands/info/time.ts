import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText } from '../../core/formatters'

export const time = createCommand({
  name: 'time',
  description: 'Display current time in your local timezone and Amsterdam',
  category: CommandCategory.INFO,
  usage: 'time',

  execute: async () => {
    const now = new Date()
    const localTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const amsterdamTime = now.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Amsterdam',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return [
      formatHeader('TIME DISPLAY'),
      formatDivider(),
      formatText('🌍 YOUR LOCAL TIME:', 'text-orange-400'),
      formatText(`╰─⊳ ${localTime}`),
      formatText('🌍 MY TIME:', 'text-orange-400'),
      formatText(`╰─⊳ ${amsterdamTime}`),
      formatDivider(),
    ]
  },
})
