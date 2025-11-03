/**
 * @fileoverview (index) TerminalCommandsRegistry
 *
 * This file auto-imports and registers all commands.
 * To add a new command:
 * 1. Create a new file in the appropriate category folder (system/info/effects/services/games)
 * 2. Export your command using createCommand()
 * 3. Import and export it here
 *
 * The command will be automatically registered and available in the terminal.
 */

import registry from '../core/CommandRegistry'

import { clear } from './system/clear'
import { help } from './system/help'
import { whoami } from './system/whoami'
import { links } from './system/links'
import { echo } from './system/echo'
import { history } from './system/history'
import { alias } from './system/alias'

import { trippy } from './effects/trippy'
import { sober } from './effects/sober'
import { matrix } from './effects/matrix'
import { cowsay } from './effects/cowsay'
import { figlet } from './effects/figlet'
import { spawn } from './effects/spawn'

import { ls, cd, cat, pwd, mkdir, touch, rm } from './filesystem/index'

import { crypto } from './info/crypto'
import { time } from './info/time'
import { neofetch } from './info/neofetch'

import { services, webDev, mobileDev, security } from './services/index'

import { games, snake, sparrow, bifi, doom, omf } from './games/index'

import { base64 } from './devtools/base64'
import { hash } from './devtools/hash'
import { uuid } from './devtools/uuid'

let commandsRegistered = false

function ensureCommandsRegistered(): void {
  if (commandsRegistered) return

  const allCommands = [
    clear,
    help,
    whoami,
    links,
    echo,
    history,
    alias,
    trippy,
    sober,
    matrix,
    cowsay,
    figlet,
    spawn,
    ls,
    cd,
    cat,
    pwd,
    mkdir,
    touch,
    rm,
    crypto,
    time,
    neofetch,
    services,
    webDev,
    mobileDev,
    security,
    games,
    snake,
    sparrow,
    bifi,
    doom,
    omf,
    base64,
    hash,
    uuid,
  ]

  registry.registerMany(allCommands)
  commandsRegistered = true
}

if (typeof window !== 'undefined') {
  queueMicrotask(ensureCommandsRegistered)
}

export {
  clear,
  help,
  whoami,
  links,
  echo,
  history,
  alias,
  trippy,
  sober,
  matrix,
  cowsay,
  figlet,
  spawn,
  ls,
  cd,
  cat,
  pwd,
  mkdir,
  touch,
  rm,
  crypto,
  time,
  neofetch,
  services,
  webDev,
  mobileDev,
  security,
  games,
  snake,
  sparrow,
  bifi,
  doom,
  omf,
  base64,
  hash,
  uuid,
  ensureCommandsRegistered,
}

export default registry
