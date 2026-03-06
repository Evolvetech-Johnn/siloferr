# Testing Strategy - Siloferr Project

## Vision
To ensure system stability, prevent regressions, and facilitate refactoring through a pyramid-based testing approach.

## Prioritized Tests (Sprint 4)

### 1. Business Logic (Unit Tests)
- **Snapshot Calculation**: Verify that the snapshot job correctly aggregates counts from the database.
- **Conversion Calculations**: Ensure percentages and rates in the dashboard are calculated correctly.

### 2. API Endpoints (Integration Tests)
- **Lead Capture**: Verify that the `/api/contact` endpoint correctly saves leads and handles validation.
- **Dashboard Analytics**: Ensure API endpoints for both Admin and Executive dashboards return correct data structures and statuses.

### 3. Critical User Flows (E2E Tests)
- **Quote Request Flow**: From visiting a product page to submitting a lead form.
- **Admin Authentication**: Ensuring secure access to restricted areas.

## Tooling
- **Test Runner**: Vitest (Next.js compatible, fast).
- **Environment**: Node.js with Prisma mocking.
- **E2E**: Playwright (optional, for later phases).

## Implementation Roadmap
1. [ ] Configure Vitest and base setup.
2. [ ] Implement tests for `AnalyticsSnapshot` generation.
3. [ ] Implement basic integration tests for CRM actions.
