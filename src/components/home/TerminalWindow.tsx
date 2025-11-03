/**
 * App-specific wrapper for Terminal component from library
 */

import type { FC } from 'react'
import { FaTerminal, FaMinus, FaPlus } from 'react-icons/fa'
import { Terminal } from '@y0f/terminal'
import { useTheme } from '../../hooks/useTheme'

const TerminalWindow: FC = () => {
  const { isDarkMode } = useTheme()

  return (
    <Terminal
      config={{
        user: 'visitor@ffi.pw',
        path: '~',
        defaultWidth: 35,
        defaultHeight: 39,
        expandedWidth: 35,
        expandedHeight: 65,
        fadeIn: 0.5,
        lineTransition: 0.2,
      }}
      theme={{ isDarkMode }}
      headerIcon={<FaTerminal />}
      expandIcon={<FaPlus />}
      collapseIcon={<FaMinus />}
    />
  )
}

export default TerminalWindow
