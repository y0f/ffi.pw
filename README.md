<div align="center">
  <img src="public/favicon.svg" width="120" height="120" alt="ffi.pw">
</div>

# ffi.pw

My personal portfolio site with an interactive terminal.

## What's this?

It's my portfolio website that features a terminal emulator. You can run commands, play games, and explore my work through the command line interface.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Cool Features

### The Terminal
Type `help` to see all commands. Here are some fun ones to try:
- `matrix` - Watch the Matrix rain animation
- `trippy` - Activate psychedelic mode
- `snake` - Play the classic game
- `doom` - Yes, it runs DOOM
- `neofetch` - System info display
- `crypto` - Check crypto prices

The terminal supports:
- Tab completion (press Tab)
- Command history (use arrow keys)
- Piping commands with `|`
- Chaining with `&&`, `||`, `;`
- A virtual filesystem you can navigate

### Visual Effects
- Dark/light mode toggle
- Animated backgrounds
- Smooth transitions
- Performance optimization for all devices

## Tech Used

- React 19 with TypeScript
- Vite for blazing fast builds
- Tailwind CSS for styling
- Framer Motion for animations
- Js-dos for game emulator within terminal
- Many tests

## Project Layout

```
ffi-vite/
├── src/                    # Main website
├── modules/
│   └── y0f-terminal/       # Terminal module (self-contained)
└── public/                 # Static assets
```

The terminal module is completely self-contained - it has all its own commands, games, styles, and tests.

## Development

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm test          # Run tests
npm run fix       # Format and lint code
```

## Adding Terminal Commands

Commands live in `modules/y0f-terminal/src/commands/`. Each command is a simple object with a name, description, and execute function. Check existing commands for examples.

## Testing

Run `npm test` to start the test watcher. The project has comprehensive test coverage for all terminal features.

## Notes

- This isn't a monorepo - the modules folder is just for organization
- All terminal assets sync automatically during build

## License

MIT