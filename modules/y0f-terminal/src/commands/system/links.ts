import { createCommand, CommandCategory } from '../../core/Command'
import {
  formatHeader,
  formatDivider,
  formatText,
  formatLink,
  formatEmptyLine,
} from '../../core/formatters'

export const links = createCommand({
  name: 'links',
  description: 'Display external links',
  category: CommandCategory.SYSTEM,
  usage: 'links',

  execute: async () => {
    return [
      formatHeader('LINKS'),
      formatDivider(),
      formatLink('YouTube', 'https://www.youtube.com/@1%D0%97%D0%977'),
      formatEmptyLine(),
      formatText('Click any link to open in new tab'),
    ]
  },
})
