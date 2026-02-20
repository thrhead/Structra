# Orchestration Plan: Fixing GitHub Actions CI/CD

## Overview
The GitHub Actions workflow (`ci.yml`) is currently failing because it references a monorepo structure that no longer exists for the web application. This plan aims to modernize the CI/CD pipeline to match the new repository structure.

## Phase 1: Planning & Research
- [x] Analyze current `ci.yml` and identify mismatches.
- [x] Verify build and test commands for Web (Root) and Mobile (`apps/mobile`).

## Phase 2: Implementation (Orchestrated)

### 1. Update CI Workflow (`devops-engineer`)
- Modify `.github/workflows/ci.yml`:
    - Remove `--workspace=apps/web` from web test steps.
    - Add a step to handle `apps/mobile` dependencies separately (cd apps/mobile && npm install).
    - Ensure correct Node.js version and caching for both environments.
    - Add build verification steps (`npm run build`).

### 2. Standardize Scripts (`frontend-specialist` & `mobile-developer`)
- Ensure root `package.json` has appropriate commands.
- Ensure `apps/mobile/package.json` build commands are CI-compatible.

### 3. Verification (`test-engineer`)
- Trigger a trial run by pushing changes.
- Verify that both Web and Mobile tests pass in the GitHub environment.

## Success Criteria
- GitHub Actions "Run Tests" job passes for both Web and Mobile.
- Dependency installation is efficient and cached.
- Build stability is verified for every push to `main`.
