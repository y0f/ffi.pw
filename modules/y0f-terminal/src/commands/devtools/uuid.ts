import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatText, formatEmptyLine } from '../../core/formatters'

export const uuid = createCommand({
  name: 'uuid',
  description: 'Generate a random UUID',
  category: CommandCategory.DEVTOOLS,
  usage: 'uuid',

  execute: async () => {
    const generatedUuid = crypto.randomUUID()

    return [
      formatHeader('UUID GENERATED'),
      formatEmptyLine(),
      formatText(generatedUuid, 'text-primary-400'),
    ]
  },
})
