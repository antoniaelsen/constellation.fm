# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed issue where constellation spotify web player would be initialized multiple times, and thus show in the devices menu multiple times
- Disabled highlighting of text in Space (on canvas)

## [0.1.0] - 2022-08-07

### Added
- Added automatic access token refresh on token expiry (401) for spotify
- Added spotify typing to frontend
- Added indicators for currently playing playlist, currently selected playlist
- Added CHANGELOG

### Changed
- Changed the FE spotify playback access token key

### Fixed
- Fixed access token parsing consistency (inconsistent key)
- Fixed Constellation component layout re-computing on rerender
