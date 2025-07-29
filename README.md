# constellaton.fm

## Build and Run

Prerequisites

- `npm` (`nvm` recommended)
- docker

```sh
# Install dependencies
npm i

# Pull pg docker container
# Run pg docker container

# Run dev server
npm run dev
```

# TODO

- Fix spotify token refresh
- Add shuffle and loop buttons
- Add Spotify Connect device management
- Transfer playback to this device if no device actively playing
- Color based on bmp/key
- Spotify pre-auth prompt
- Spotify subscription validation (for player)
- Handle user local file tracks (no spotify ID)
- Constellation edge trail reflects play history, use colored edges to reflect expected next tracks
- Control panel
  - Show nameplates
  - Orbit around active star / center
  - Color criteria
- Album art on star sphere
