import { type FC } from 'react'
import JsDosGame from './JsDosGame.tsx'

import type { GameComponentProps } from '../../hooks/useGameHandler'

type OmfGameProps = GameComponentProps

const OmfGame: FC<OmfGameProps> = ({ onClose, isDarkMode }) => {
  const controls = [
    { key: 'Numpad', description: 'Move/Jump' },
    { key: 'Enter', description: 'Punch' },
    { key: 'Right Shift', description: 'Kick' },
    { key: 'ESC', description: 'In-game Menu' },
    { key: 'Ctrl+Q or F10', description: 'Exit Game' },
  ]

  const omfConfig = {
    cycles: '15000',
    frameskip: 0,
    core: 'dynamic',
    memsize: 16,
    rate: 11025,
    blocksize: 512,
    prebuffer: 100,
    nosound: false,
  }

  return (
    <JsDosGame
      isDarkMode={isDarkMode}
      onClose={onClose}
      gamePath='/games/omf/omf.zip'
      executable={['cd OneMustF\\OMF', 'OMF.EXE']}
      gameName='One Must Fall 2097'
      controls={controls}
      dosboxConfig={omfConfig}
    />
  )
}

export default OmfGame
