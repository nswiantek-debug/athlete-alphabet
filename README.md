Athlete Alphabet MLB V3.4

V3.4 MLB stabilization release.

- Preserves V3.3.3 spoiler-safe matching, suffix handling, universal Players Named progress, hint behavior, and team themes.
- Adds the agreed July 31, 2026 active-roster snapshot overlay for all 30 MLB clubs. The app labels the cutoff in the footer.
- Snapshot source: eliaszeller/mlb-2026-data-model active_rosters.csv, derived from MLB StatsAPI and retrieved 2026-07-31.
- The roster overlay is loaded from the frozen/source CSV URL when the app opens; if unavailable, the bundled historical/player data remains usable.
- Normalizes 2026 team-code aliases (LAA→ANA and MIA→FLA) to the app's franchise keys.
- Expands Region from Chicago-only to a reusable sports-geography framework.
- Current MLB Regions include Arizona, Atlanta, Baltimore, Boston/New England, Chicago, Cincinnati, Cleveland, Colorado, Detroit, Houston, Kansas City, Los Angeles, Miami/South Florida, Minnesota, New York, Philadelphia, Pittsburgh, San Diego, San Francisco Bay Area, Sacramento, Seattle, St. Louis, Tampa Bay, Dallas–Fort Worth, Toronto, Washington DC, and Wisconsin.
- Historical MLB relocation windows are Region-aware: Brooklyn/New York Giants remain New York; Oakland A's seasons remain Bay Area; 2025–26 Athletics are Sacramento; Braves, Senators/Twins, Senators/Rangers, Expos/Nationals, Browns/Orioles, and Athletics lineage moves are mapped by season.
- Region architecture is designed for future NFL, NBA, NHL and WNBA additions. Wisconsin is intentionally statewide; Baltimore and Washington remain separate.
- Existing localStorage progress keys are unchanged, so upgrading does not reset Players Named.
