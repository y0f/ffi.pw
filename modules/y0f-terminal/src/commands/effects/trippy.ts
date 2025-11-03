import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'

export const trippy = createCommand({
  name: 'trippy',
  description: 'Activate psychedelic visual effects',
  category: CommandCategory.EFFECTS,
  usage: 'trippy',

  execute: async ({ setIsTrippy }) => {
    setIsTrippy(true)
    return [
      formatText('>>> TRIPPY MODE ACTIVATED <<<', 'text-primary-400'),
      formatText("Welcome to the matrix... Type 'sober' when you've had enough"),
    ]
  },
})
