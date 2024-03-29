# bedrock-web-profile ChangeLog

## 7.0.0 - 2023-10-16

### Changed
- **BREAKING**: Drop support for Node.js < 18.
- Use `@digitalbazaar/http-client@4.0`. Requires Node.js 18+.

## 6.0.0 - 2022-08-19

### Changed
- **BREAKING**: Use `exports` instead of `module`.
- Update dependencies.
- Lint module.

## 5.0.0 - 2022-04-10

### Changed
- **BREAKING**: Rename package to `@bedrock/web-profile`.
- **BREAKING**: Convert to module (ESM).

## 4.0.0 - 2022-02-10

### Changed
- **BREAKING**: `delegateAgentCapabilities` has been replaced by
  `delegateAgentCapability`. The new function delegates a specific zcap,
  which must be passed. The old function delegated a profile agent's zcap
  invocation key -- which is no longer permitted.

## 3.0.0 - 2021-05-06

### Changed
- **BREAKING**: Remove `axios` and use `@digitalbazaar/http-client@1.0.0`.
  This is breaking because errors thrown by the two libraries are not identical.

## 2.4.1 - 2020-12-11

### Changed
- Remove encodeURIComponent() for query params.

## 2.4.0 - 2020-07-01

### Changed
- Update deps.
- Update test deps.
- Update CI workflow.

## 2.3.0 - 2020-06-29

### Changed
- Improve jsdocs.
- Update test deps and CI workflow.

## 2.2.0 - 2020-04-20

### Added
- Add support for Veres One type DIDs in profile creation.

## 2.1.0 - 2020-04-02

### Added
- Add support for application tokens.

## 2.0.0 - 2020-03-12

### Changed
- **BREAKING**: Remove getAgentCapabilitySet API.
- **BREAKING**: Change signature of delegateAgentCapabilities API.

## 1.0.0 - 2020-03-06

### Added
- Added core files.

- See git history for changes.
