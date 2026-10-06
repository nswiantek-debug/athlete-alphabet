# Athlete Alphabet V4.0.4

This build replaces the failing NFL runtime downloader with an embedded JavaScript NFL verification dataset. It is intentionally a verification build: it proves the no-network architecture and includes Walter Payton plus representative historical/current players across all 32 current NFL franchises.

Important: this is not yet the complete 1920–2026 NFL player database. Do not use its possible-answer counts as final NFL counts. The next data step is to compile the full nflverse season-level roster history into the same embedded format.

MLB data and existing universal progress keys are unchanged. NFL team color themes remain enabled.


## V4.0.4 fix
- NFL opens in All-Time when switching from MLB, so historical players are not silently excluded by a retained Modern/Current era filter.
- Added embedded-data self-test for Walter Payton (WP, CHI, 1975–1987).
- Jump To zero-result message now includes the active era.
- NFL remains fully embedded with no runtime roster downloads.
