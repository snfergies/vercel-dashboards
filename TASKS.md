# Follow-up Tasks

## Fix a Typo
- **Issue:** The regional dashboard opens the sales dashboard with a `franchise` query parameter, but `sales/index.html` expects a `slug` parameter. This mismatch prevents the target franchise from loading. (See `regional/index.html`, line ~537.)
- **Task:** Update the link generation to use `?slug=` so the sales dashboard receives the correct parameter.

## Fix a Bug
- **Issue:** The regional dashboard's API constant points to `/api/franchises/list`, but the backend only exposes `/api/franchises` for listing franchises. Requests to `/api/franchises/list` therefore 404. (See `regional/index.html`, lines ~265-268 and `api/franchises/index.js`.)
- **Task:** Point the front-end list fetch to the implemented `/api/franchises` endpoint (or add a matching handler) so locations load correctly.

## Correct Documentation/Comment
- **Issue:** `sales/index.html` documents a `GET /api/franchises/[slug]` endpoint that should return franchise data, but `api/franchises/[slug].js` only handles `DELETE`. The inline comment misleads future work. (See `sales/index.html`, line ~287 and `api/franchises/[slug].js`.)
- **Task:** Update the comment or add documentation explaining the actual data source until a matching GET endpoint exists.

## Improve Testing
- **Issue:** The `api/franchises/index.js` handler enforces required fields and handles errors, but there are no automated tests to prevent regressions (e.g., ensuring missing `slug`/`name`/`region` returns 400). (See `api/franchises/index.js`.)
- **Task:** Add a Node-based test suite (e.g., using `node:test`) covering successful GET/POST responses and validation failures for this handler.
