import type { OutputObject } from '../core/Command'

const getWelcomeTextOutput = (): OutputObject[] => [
  {
    parts: [
      { text: 'root@ffi.pw', color: 'text-primary-400' },
      { text: ':', color: 'text-white' },
      { text: '~', color: 'text-primary-400' },
      { text: '# ', color: 'text-white' },
      { text: './welcome.sh', color: 'text-primary-400' },
    ],
    isCommand: true,
    className: 'pb-0.5',
  },
  {
    parts: [
      { text: 'welcome to ', color: 'text-white' },
      { text: 'ffi.pw', color: 'text-primary-400' },
      { text: '!', color: 'text-white' },
      { text: ' [', color: 'text-gray-400' },
      { text: 'currently under construction', color: 'text-gray-400' },
      { text: ']', color: 'text-gray-400' },
    ],
    isCommand: false,
    className: 'pb-2',
  },
  {
    parts: [
      { text: 'terminal updated: ', color: 'text-white' },
      { text: `${new Date().toLocaleDateString('en-GB')}`, color: 'text-primary-400' },
    ],
    isCommand: false,
  },
  {
    parts: [
      { text: 'your IP: ', color: 'text-white' },
      { text: '[hidden] ', color: 'text-primary-400' },
      { text: 'is logged to prevent abuse.', color: 'text-white' },
    ],
    isCommand: false,
    className: '',
  },
  {
    text: `
       ___         ___           ___
      /\\  \\       /\\  \\         /\\__\\
      \\:\\  \\     /::\\  \\       /::|  |
  ___ /::\\__\\   /:/\\:\\  \\     /:|:|  |
 /\\  /:/\\/__/  /:/  \\:\\  \\   /:/|:|  |__
 \\:\\/:/  /    /:/__/ \\:\\__\\ /:/ |:| /\\__\\
  \\::/  /     \\:\\  \\ /:/  / \\/__|:|/:/  /
   \\/__/       \\:\\  /:/  /      |:/:/  /
                \\:\\/:/  /       |::/  /
                 \\::/  /        /:/  /
                  \\/__/         \\/__/             `,
    isCommand: false,
    color: 'text-white',
    className: 'initial-output pb-2',
  },
  { text: '', isCommand: false },
  {
    text: "Type 'help' for details on the commands",
    isCommand: false,
    color: 'text-gray-400',
  },
  { text: '', isCommand: false },
]

export default getWelcomeTextOutput
