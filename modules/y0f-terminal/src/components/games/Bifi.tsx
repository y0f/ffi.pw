import { type FC } from 'react'
import JsDosGame from './JsDosGame.tsx'

import type { GameComponentProps } from '../../hooks/useGameHandler'

type BifiGameProps = GameComponentProps

const BifiGame: FC<BifiGameProps> = ({ onClose, isDarkMode }) => {
  const controls = [
    { key: '↑↓←→', description: 'Steer' },
    { key: 'Ctrl', description: 'Accelerate' },
    { key: 'Alt', description: 'Brake' },
    { key: 'Space', description: 'Use Power-up' },
    { key: 'ESC', description: 'Exit' },
  ]

  const bifiConfig = {
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
      gamePath='/games/bifi/bifi.zip'
      executable='BIFI3WEB.BAT'
      gameName='2FAST4YOU'
      controls={controls}
      dosboxConfig={bifiConfig}
      canvasClassName='h-[440px]'
    />
  )
}

export default BifiGame
