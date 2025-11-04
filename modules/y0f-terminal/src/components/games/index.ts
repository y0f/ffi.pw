import type { GameConfig } from '../../hooks/useGameHandler'

import Snake from './Snake'
import Sparrow from './Sparrow'
import Doom from './Doom'
import Bifi from './Bifi'
import Omf from './Omf'

export { default as Snake } from './Snake'
export { default as Sparrow } from './Sparrow'
export { default as Doom } from './Doom'
export { default as Bifi } from './Bifi'
export { default as Omf } from './Omf'
export { default as JsDosGame } from './JsDosGame'

export const BUILTIN_GAME_CONFIGS: Record<string, GameConfig> = {
  snake: { component: Snake, isJsDos: false },
  sparrow: { component: Sparrow, isJsDos: false },
  doom: { component: Doom, isJsDos: true },
  bifi: { component: Bifi, isJsDos: true },
  omf: { component: Omf, isJsDos: true },
}
