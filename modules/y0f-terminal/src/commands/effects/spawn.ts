/**
 * App-specific command for owl easter egg
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'

export const spawn = createCommand({
  name: 'spawn',
  description: 'Spawn the bird',
  category: CommandCategory.EFFECTS,
  usage: 'spawn',
  hidden: true,

  execute: async () => {
    const event = new CustomEvent('spawnOwl')
    document.dispatchEvent(event)

    return [formatText('🦉', 'text-primary-400'), formatText('The owl has been summoned...')]
  },
})
