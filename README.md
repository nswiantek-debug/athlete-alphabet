# Athlete Alphabet V4.0.1 — MLB + NFL

## What's new
- NFL added as the second sport.
- NFL Team, Region, and League scopes.
- NFL historical season-roster data from 1920–2026 via nflverse.
- NFL franchise lineage support for relocations (Raiders, Rams, Chargers, Colts, Cardinals, Titans/Oilers, etc.).
- Region eligibility follows where a team played at the time.
- Existing MLB V3.4 data and universal Players Named progress are preserved.
- Overall player completion now shows one decimal place when progress is under 1%.

## Important first NFL load
The first time NFL is selected, the app downloads the nflverse season roster files and builds a compact player index in the browser. A progress message shows seasons loaded. The derived NFL index is then cached in IndexedDB on that device, so later NFL launches are much faster.

NFL source pattern:
https://github.com/nflverse/nflverse-data/releases/download/rosters/roster_YEAR.csv

## MLB data
MLB remains the V3.4 database with the July 31, 2026 active-roster snapshot overlay.

## Upload
Replace/upload all 7 files in the ZIP:
- index.html
- app.js
- styles.css
- players.js
- roster-snapshot.js
- nfl-data.js
- README.md

Do not clear browser website data; Players Named progress is stored locally.
