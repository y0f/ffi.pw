# Terminal Commands Reference

Complete reference for all available terminal commands at ffi.pw

## System Commands

### clear
**Description:** Clear the terminal screen  
**Usage:** `clear`  
**Aliases:** `cls`  
**Details:** Removes all output from the terminal display.

### reset
**Description:** Reset terminal state  
**Usage:** `reset`  
**Details:** Clears the terminal and resets all state including trippy mode.

### help
**Description:** Display available commands  
**Usage:** `help [command]`  
**Details:** Shows list of all commands. Use `help <command>` for detailed help on a specific command.

### whoami
**Description:** Show developer information  
**Usage:** `whoami`  
**Details:** Displays information about the developer (FFI).

### links
**Description:** Show important links  
**Usage:** `links`  
**Details:** Displays clickable links to social media and other resources.

### history
**Description:** Show command history  
**Usage:** `history [-c | --clear] [search]`  
**Aliases:** `h`  
**Options:**
- `-c, --clear`: Clear all history
- `[search]`: Filter history by search term

**Details:** Displays numbered list of previously executed commands. History persists during the session.

### alias
**Description:** Create command aliases  
**Usage:** `alias [name=command]`  
**Details:** Create shortcuts for commands. Run without arguments to list all aliases.

**Examples:**
```bash
alias                    # List all aliases
alias ll=games           # Create alias 'll' for 'games'
alias h=history          # Create alias 'h' for 'history'
```

### echo
**Description:** Echo text to terminal  
**Usage:** `echo <text>`  
**Details:** Prints the provided text to the terminal.

---

## Information Commands

### neofetch
**Description:** Display system information  
**Usage:** `neofetch`  
**Details:** Shows browser, OS, screen resolution, and color scheme information in a stylized ASCII art format.

### time
**Description:** Show current time  
**Usage:** `time`  
**Details:** Displays current date and time in a formatted display.

### crypto
**Description:** Show cryptocurrency prices  
**Usage:** `crypto [--refresh]`  
**Options:**
- `--refresh`: Force refresh data from API

**Details:** Displays real-time prices for Bitcoin, Ethereum, Ripple, and Dogecoin with 24h change, market cap, and volume. Data is cached for 5 minutes.

---

## Developer Tools

### base64
**Description:** Encode or decode base64 strings  
**Usage:** `base64 [-d | --decode] <text>`  
**Aliases:** `b64`  
**Options:**
- `-d, --decode`: Decode instead of encode

**Examples:**
```bash
base64 hello              # Encode 'hello' to base64
base64 -d aGVsbG8=        # Decode base64 string
```

### hash
**Description:** Generate cryptographic hash  
**Usage:** `hash [--algo=sha256|sha384|sha512] <text>`  
**Options:**
- `--algo`: Hash algorithm (default: sha256)

**Supported Algorithms:**
- SHA-256 (default)
- SHA-384
- SHA-512

**Examples:**
```bash
hash hello                      # SHA-256 hash of 'hello'
hash --algo=sha512 hello        # SHA-512 hash of 'hello'
```

### uuid
**Description:** Generate a random UUID  
**Usage:** `uuid`  
**Details:** Generates a random UUID v4 using the Web Crypto API.

---

## Effects Commands

### trippy
**Description:** Enable trippy visual mode  
**Usage:** `trippy`  
**Details:** Activates psychedelic visual effects on the website.

### sober
**Description:** Disable trippy mode  
**Usage:** `sober`  
**Details:** Disables trippy visual effects and returns to normal display.

### spawn
**Description:** Trigger the owl easter egg  
**Usage:** `spawn`  
**Details:** Summons the mystical owl. Can you find it?

---

## Services Commands

### services
**Description:** View available services  
**Usage:** `services`  
**Details:** Lists all service categories offered.

### webdev
**Description:** Web development services  
**Usage:** `webdev`  
**Details:** Information about web development services including React, TypeScript, Node.js, and more.

### mobiledev
**Description:** Mobile development services  
**Usage:** `mobiledev`  
**Details:** Information about mobile app development services for iOS and Android.

### security
**Description:** Security services  
**Usage:** `security`  
**Details:** Information about cybersecurity and penetration testing services.

---

## Games

### games
**Description:** List available games  
**Usage:** `games`  
**Details:** Shows all playable terminal games.

### snake
**Description:** Play Snake game  
**Usage:** `snake`  
**Controls:**
- Arrow keys or WASD to move
- P to pause
- ESC to exit

**Details:** Classic snake game. Eat food to grow and avoid hitting walls or yourself!


### sparrow
**Description:** Play Flappy Bird clone  
**Usage:** `sparrow`  
**Controls:**
- SPACE or Click to flap
- ESC to exit

**Details:** Navigate through pipes by tapping to flap.

### doom
**Description:** Play DOOM (1993)  
**Usage:** `doom`  
**Details:** Classic DOOM running in DOS emulator (js-dos). Full keyboard and mouse support.

### bifi
**Description:** Play BiFi Racing  
**Usage:** `bifi`  
**Details:** Retro DOS racing game.

### omf
**Description:** Play One Must Fall 2097  
**Usage:** `omf`  
**Details:** Classic DOS fighting game running in emulator.

---

## Tips & Tricks

- Use **Tab** for command autocompletion
- Use **Up/Down arrows** to navigate command history
- Use **Ctrl+C** to cancel current input
- Commands are case-insensitive
- You can chain commands with aliases
- History is preserved during your session
- Games can be exited with ESC key

---

## Special Features

### Tab Completion
Start typing a command and press Tab to autocomplete. If multiple matches exist, all options will be displayed.

### Command History
All commands are saved in history. Use the `history` command to view them, or press Up/Down arrows to navigate.

### Aliases
Create custom shortcuts with the `alias` command. Perfect for frequently used commands!

### Easter Eggs
The terminal contains hidden surprises. Try different commands and explore! ;)

---

**Version:** 2.0  
**Last Updated:** 2025-01-03  
**Total Commands:** 27
