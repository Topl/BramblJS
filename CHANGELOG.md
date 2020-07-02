# Changelog
All notable changes to this project will be documented in this file.<br/>
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).<br/>
## 1.0.0 - 2020.04.17
### Initial release
* Published package to `npm` and changed name to Brambl-JS

## 1.1.1 - 2020.07.01
### Added
* A static function in Brambl to allow accessing the hash utilities without creating an instance of Brambl

---
## Deprecated
* LokiJS has been deprecated and renamed to Brambl-JS and is now available for install via `npm install brambljs`
## 3.0.2 - 2020.04.10
### Added
* Stress test scripts added
### Changed
* Valhalla chain provider URL to `https://valhalla.torus.topl.co'
* Moved testScripts beneath the tests/ directory
## 3.0.1 - 2020.04.09
### Added
* Primary `Brambl` class incorporating `KeyManager` and `Requests`
* JSDoc and GitHub action to automatically build documentation
* JSDoc config file
### Changed
* Fixed the polling transaction function to identify pending transactions
* Updated README with latest usage changes and examples