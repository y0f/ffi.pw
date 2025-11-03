import { Command, CommandContext, CommandCategoryType, OutputObject } from './Command'

/**
 * @fileoverview CommandRegistry
 *
 * Central registry for all terminal commands.
 * Provides registration, lookup, and execution management.
 */
class CommandRegistry {
  private commands: Map<string, Command>
  private aliases: Map<string, string>
  private categories: Map<CommandCategoryType, Command[]>

  constructor() {
    this.commands = new Map()
    this.aliases = new Map()
    this.categories = new Map()
  }

  register(command: Command): this {
    if (!command.name) {
      throw new Error('Command must have a name')
    }

    const normalizedName = command.name.toLowerCase()
    this.commands.set(normalizedName, command)

    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        const normalizedAlias = alias.toLowerCase()
        if (this.aliases.has(normalizedAlias)) {
          throw new Error(`Alias '${alias}' is already registered`)
        }
        this.aliases.set(normalizedAlias, normalizedName)
      })
    }

    if (!this.categories.has(command.category)) {
      this.categories.set(command.category, [])
    }
    this.categories.get(command.category)?.push(command)

    return this
  }

  registerMany(commands: Command[]): this {
    commands.forEach((cmd) => this.register(cmd))
    return this
  }

  get(name: string): Command | undefined {
    const normalizedName = name.toLowerCase()

    if (this.commands.has(normalizedName)) {
      return this.commands.get(normalizedName)
    }

    const commandName = this.aliases.get(normalizedName)
    if (commandName) {
      return this.commands.get(commandName)
    }

    return undefined
  }

  has(name: string): boolean {
    const normalizedName = name.toLowerCase()
    return this.commands.has(normalizedName) || this.aliases.has(normalizedName)
  }

  getAll(): Command[] {
    return Array.from(this.commands.values())
  }

  getByCategory(category: CommandCategoryType): Command[] {
    return this.categories.get(category) || []
  }

  getCategories(): CommandCategoryType[] {
    return Array.from(this.categories.keys())
  }

  getNames(): string[] {
    return Array.from(this.commands.keys())
  }

  getAllNames(): string[] {
    const names = Array.from(this.commands.keys())
    const aliasNames = Array.from(this.aliases.keys())
    return [...names, ...aliasNames]
  }

  getVisibleNames(): string[] {
    const visibleCommands = Array.from(this.commands.values())
      .filter((cmd) => !cmd.hidden)
      .map((cmd) => cmd.name)

    const visibleAliases = Array.from(this.aliases.entries())
      .filter(([_alias, commandName]) => {
        const command = this.commands.get(commandName)
        return command && !command.hidden
      })
      .map(([alias]) => alias)

    return [...visibleCommands, ...visibleAliases]
  }

  resolveAlias(alias: string): string | null {
    const normalizedAlias = alias.toLowerCase()
    return this.aliases.get(normalizedAlias) || null
  }

  async execute(name: string, context: CommandContext): Promise<OutputObject[]> {
    const command = this.get(name)
    if (!command) {
      throw new Error(`Command not found: ${name}`)
    }

    return await command.execute(context)
  }

  clear(): this {
    this.commands.clear()
    this.aliases.clear()
    this.categories.clear()
    return this
  }
}

export { CommandRegistry }

export const registry = new CommandRegistry()

export default registry
