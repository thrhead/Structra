# Plan: Fix Mobile Network Error (CORS Failure)

## Problem Description
The mobile application fails to start a job, showing a "Network error: Network Error" (status 0). 
The browser/device logs show `net::ERR_FAILED` for `POST /api/worker/jobs/:id/start`.

## Root Cause Analysis
The mobile app's API service (`apps/mobile/src/services/api.js`) adds a custom header `X-Client-Version` to all write requests for conflict detection. This triggers a CORS preflight (OPTIONS) request. 
However, the backend's CORS configuration in `src/middleware.ts` does not include `X-Client-Version` in the `Access-Control-Allow-Headers` allow-list. 
As a result, the preflight request fails with a 403 or is simply rejected by the browser, preventing the actual POST request from being sent.

## Proposed Changes

### 1. Backend: Update Middleware
- Update `src/middleware.ts` to include `X-Client-Version` in the `Access-Control-Allow-Headers` list.
- Also add `Accept-Language` to the list to ensure future localization support doesn't trigger similar issues.

### 2. Verification
- Verify the change in `src/middleware.ts`.
- Simulate an OPTIONS request to `/api/worker/jobs/[id]/start` to ensure the response headers include `X-Client-Version`.

## Implementation Steps (Phase 2)
1. **backend-specialist**: Update `src/middleware.ts`.
2. **mobile-developer**: Review the change and confirm if any other custom headers are used (e.g., `X-Locale`).
3. **test-engineer**: Run a verification script to check CORS headers for the affected endpoint.

## Verification Command
```bash
# This is a conceptual check
curl -X OPTIONS https://field-service-management-lovat.vercel.app/api/worker/jobs/cmm07p6ep00019dodaclkfaby/start 
  -H "Origin: http://localhost:8081" 
  -H "Access-Control-Request-Method: POST" 
  -H "Access-Control-Request-Headers: X-Client-Version,Authorization,X-Platform" 
  -i
```
