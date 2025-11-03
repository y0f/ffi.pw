/**
 * Hook to get list of all commands from registry
 * Provides a clean API for displaying command documentation
 */

import { useMemo } from 'react'
import registry from '../core/CommandRegistry'
import type { Command, CommandCategoryType } from '../core/Command'

export interface UseCommandListReturn {
  commands: Command[]
  categories: CommandCategoryType[]
  getByCategory: (category: CommandCategoryType) => Command[]
}

export function useCommandList(): UseCommandListReturn {
  const commands = useMemo(() => registry.getAll().filter((cmd) => !cmd.hidden), [])
  const categories = useMemo(() => registry.getCategories(), [])

  const getByCategory = useMemo(
    () => (category: CommandCategoryType) => registry.getByCategory(category),
    [],
  )

  return {
    commands,
    categories,
    getByCategory,
  }
}

export default useCommandList
