import { type FC } from 'react'
import JsDosGame from './JsDosGame.tsx'

import type { GameComponentProps } from '../../hooks/useGameHandler'

type DoomGameProps = GameComponentProps

const DoomGame: FC<DoomGameProps> = ({ onClose, isDarkMode }) => {
  const controls = [
    { key: '↑↓←→', description: 'Move' },
    { key: 'Ctrl', description: 'Fire' },
    { key: 'Space', description: 'Use/Open' },
    { key: '1-7', description: 'Weapons' },
    { key: 'ESC', description: 'Exit' },
  ]

  const doomConfig = {
    cycles: 'max',
    frameskip: 0,
    core: 'dynamic',
    memsize: 16,
    rate: 22050,
    blocksize: 2048,
    prebuffer: 40,
    nosound: false,
  }

  return (
    <JsDosGame
      isDarkMode={isDarkMode}
      onClose={onClose}
      gamePath='/games/doom/doom.zip'
      executable='DOOM.EXE'
      gameName='DOOM'
      controls={controls}
      dosboxConfig={doomConfig}
    />
  )
}

export default DoomGame
