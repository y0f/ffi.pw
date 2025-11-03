import { createCommand, CommandCategory } from '../../core/Command'

export const clear = createCommand({
  name: 'clear',
  description: 'Clear the terminal screen and reset state',
  category: CommandCategory.SYSTEM,
  usage: 'clear',

  execute: async ({ setOutput, setActiveGame, setIsTrippy }) => {
    setIsTrippy(false)
    setActiveGame(null)
    setOutput([])
    return []
  },
})
