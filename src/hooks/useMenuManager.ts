import { useState, useEffect, useCallback } from 'react'

interface MenuListener {
  onClose: () => void
  onUpdate: (activeMenus: Set<string>) => void
}

interface MenuRegistry {
  activeMenus: Set<string>
  listeners: Map<string, MenuListener>
  addActiveMenu(menuId: string): void
  removeActiveMenu(menuId: string): void
  closeAllExcept(currentMenuId: string): void
  notifyAllListeners(): void
  registerListener(
    menuId: string,
    onClose: () => void,
    onUpdate: (activeMenus: Set<string>) => void,
  ): void
  unregisterListener(menuId: string): void
}

const menuRegistry: MenuRegistry = {
  activeMenus: new Set<string>(),
  listeners: new Map<string, MenuListener>(),

  addActiveMenu(menuId: string): void {
    this.activeMenus.add(menuId)
    this.notifyAllListeners()
  },

  removeActiveMenu(menuId: string): void {
    this.activeMenus.delete(menuId)
    this.notifyAllListeners()
  },

  closeAllExcept(currentMenuId: string): void {
    this.listeners.forEach((listener, id) => {
      if (id !== currentMenuId) listener.onClose()
    })
  },

  notifyAllListeners(): void {
    this.listeners.forEach((listener) => {
      listener.onUpdate(new Set(this.activeMenus))
    })
  },

  registerListener(
    menuId: string,
    onClose: () => void,
    onUpdate: (activeMenus: Set<string>) => void,
  ): void {
    this.listeners.set(menuId, { onClose, onUpdate })
  },

  unregisterListener(menuId: string): void {
    this.listeners.delete(menuId)
  },
}

export interface MenuManager {
  isOpen: boolean
  toggleMenu: () => void
  openMenu: () => void
  closeMenu: () => void
  activeMenus: Set<string>
}

export function useMenuManager(menuId: string, closeOthersOnOpen: boolean = true): MenuManager {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeMenus, setActiveMenus] = useState<Set<string>>(new Set())

  const handleMenuStateChange = useCallback(
    (shouldOpen: boolean) => {
      setIsOpen(shouldOpen)

      if (shouldOpen) {
        menuRegistry.addActiveMenu(menuId)
        if (closeOthersOnOpen) menuRegistry.closeAllExcept(menuId)
      } else {
        menuRegistry.removeActiveMenu(menuId)
      }
    },
    [menuId, closeOthersOnOpen],
  )

  const toggleMenu = useCallback(
    () => handleMenuStateChange(!isOpen),
    [isOpen, handleMenuStateChange],
  )

  const openMenu = useCallback(
    () => !isOpen && handleMenuStateChange(true),
    [isOpen, handleMenuStateChange],
  )

  const closeMenu = useCallback(
    () => isOpen && handleMenuStateChange(false),
    [isOpen, handleMenuStateChange],
  )

  useEffect(() => {
    const handleStateUpdate = (updatedMenus: Set<string>) => setActiveMenus(updatedMenus)
    const handleExternalClose = () => handleMenuStateChange(false)

    menuRegistry.registerListener(menuId, handleExternalClose, handleStateUpdate)

    return () => {
      menuRegistry.unregisterListener(menuId)
      if (isOpen) menuRegistry.removeActiveMenu(menuId)
    }
  }, [menuId, handleMenuStateChange, isOpen])

  return { isOpen, toggleMenu, openMenu, closeMenu, activeMenus }
}
