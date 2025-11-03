import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { motion } from 'framer-motion'
import useIsMobile from '../../hooks/useIsMobile'
import { useTheme } from '../../hooks/useTheme'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'
import Owl from '../ui/Owl.tsx'
import Logo from '../ui/Logo.tsx'

interface FooterProps {
  isSmoking?: boolean
  owlVisible?: boolean
}

const Footer: FC<FooterProps> = ({ isSmoking = false, owlVisible = false }) => {
  const [showFooter, setShowFooter] = useState<boolean>(false)
  const [pageHasScroll, setPageHasScroll] = useState<boolean>(false)
  const isMobile = useIsMobile()
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (isMobile) return

    const checkScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5
      const canScroll = scrollHeight > clientHeight

      setPageHasScroll(canScroll)
      setShowFooter(!canScroll || atBottom)
    }

    checkScroll()
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', checkScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', checkScroll)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: showFooter ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={combineThemePatterns(
        isDarkMode,
        `fixed bottom-0 w-full fira text-xs text-center px-4 z-0 ${pageHasScroll ? 'pointer-events-none' : 'pointer-events-auto'}`,
        themePatterns.text.secondary,
      )}
    >
      <span
        className={combineThemePatterns(
          isDarkMode,
          'border-t border-l border-r rounded-t-lg pt-1 px-3 pb-1 text-[1.1em] inline-flex items-center gap-2',
          themePatterns.border.primary,
        )}
      >
        <span>© {new Date().getFullYear()}</span>
        <Logo className='h-3.5 w-auto inline-block' />
        <span>Jоnаthаn</span>
      </span>

      {owlVisible && <Owl isSmoking={isSmoking} />}
    </motion.footer>
  )
}

export default Footer
