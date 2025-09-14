# Project Documentation

## 1.Project Setup

### What

* Node.js + TypeScript backend with MongoDB (via Mongoose).
* Jest for testing.
* `mongodb-memory-server` for isolated in-memory database during tests.

### How

* Initialized with `npm init -y`.
* Installed dependencies:

  * `typescript`, `ts-node`, `@types/node` (TS support).
  * `mongoose` (MongoDB ODM).
  * `jest`, `ts-jest`, `@types/jest` (testing).
  * `mongodb-memory-server` (in-memory DB for tests).
* Configured:

  * `tsconfig.json` → TypeScript compiler setup.
  * `jest.config.js` → test environment set to Node + TS transform.

### Why

* TypeScript = type safety.
* In-memory Mongo = clean test isolation.
* Jest = stable and popular testing framework.

---
