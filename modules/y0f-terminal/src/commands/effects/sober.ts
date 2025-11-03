import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'

export const sober = createCommand({
  name: 'sober',
  description: 'Deactivate psychedelic visual effects',
  category: CommandCategory.EFFECTS,
  usage: 'sober',

  execute: async ({ setIsTrippy }) => {
    setIsTrippy(false)
    return [formatText('Back to reality', 'text-primary-400')]
  },
})
