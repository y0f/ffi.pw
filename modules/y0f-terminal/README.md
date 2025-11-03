# Terminal Module

A self-contained terminal emulator component for React.

## How to Use

```tsx
import { Terminal } from '../terminal'

<Terminal
  config={{ user: 'guest', path: '~' }}
  theme={{ isDarkMode: true }}
/>
```

## Commands

The terminal includes 27+ built-in commands:

- **System**: clear, help, whoami, history, alias
- **Filesystem**: ls, cd, pwd, cat, mkdir, touch, rm
- **Effects**: matrix, trippy, cowsay, figlet, spawn
- **Games**: snake, sparrow, doom, bifi, omf
- **DevTools**: base64, hash, uuid
- **Info**: neofetch, time, crypto

## Adding Commands

Create a new file in `src/commands/[category]/`:

```typescript
export const mycommand = createCommand({
  name: 'mycommand',
  description: 'Description here',
  category: CommandCategory.SYSTEM,

  execute: async () => {
    return [{ text: 'Hello!' }]
  }
})
```

Then register it in `src/commands/index.ts`.

## Animated Commands

For animations like the matrix effect:

```typescript
const animation = {
  start: (context) => {
    animateContinuous(
      (time) => [{ text: `Frame ${time}` }],
      30,
      context
    )
  }
}

export const animated = createCommand({
  name: 'animated',
  execute: createAnimatedCommand('animated', animation)
})
```

## Testing

```bash
npm test
```

The project includes 365+ tests covering all functionality.

## Structure

```
src/
├── commands/       # Command implementations
├── components/     # Terminal UI and games
├── core/           # Core systems
├── hooks/          # React hooks
├── styles/         # CSS
└── __tests__/      # Tests
```