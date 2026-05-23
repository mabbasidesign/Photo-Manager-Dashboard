# Angular CRUD Practice

A simple Angular practice project that consumes a public test API (JSONPlaceholder Photos) and demonstrates full CRUD flow.

## What This Project Covers

- Read a list of images from a public API.
- Create a new image item.
- Update an existing image item.
- Delete an image item.
- Route-based flows for list/create/edit.
- Lazy-loaded feature routes.
- CanDeactivate guard for unsaved form changes.
- Global HTTP interceptor for loading and API error handling.
- Feature facade state management with RxJS (`BehaviorSubject` + `combineLatest`).
- Search, sort, and pagination synchronized with URL query parameters.
- Performance optimizations (`trackBy` + `OnPush` change detection).
- Mock authentication flow with login, protected routes, token simulation, and logout.
- Organize Angular code using a feature-based folder structure.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm start
```

3. Open in browser:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Folder Structure

```text
angular-crud-practice/
|- src/
|  |- app/
|  |  |- core/
|  |  |  |- models/
|  |  |  |  |- photo.model.ts
|  |  |  |- interceptors/
|  |  |  |  |- http-status.interceptor.ts
|  |  |  |  |- mock-auth.interceptor.ts
|  |  |  |- guards/
|  |  |  |  |- auth.guard.ts
|  |  |  |- services/
|  |  |     |- photo-api.service.ts
|  |  |     |- api-error.service.ts
|  |  |     |- http-loading.service.ts
|  |  |     |- auth.service.ts
|  |  |- features/
|  |  |  |- auth/
|  |  |  |  |- pages/
|  |  |  |     |- login-page/
|  |  |  |        |- login-page.component.ts
|  |  |  |        |- login-page.component.html
|  |  |  |        |- login-page.component.css
|  |  |  |- photos/
|  |  |     |- data/
|  |  |     |  |- photos-facade.service.ts
|  |  |     |- guards/
|  |  |     |  |- pending-changes.guard.ts
|  |  |     |- photos.routes.ts
|  |  |     |- components/
|  |  |     |  |- photo-form/
|  |  |     |  |  |- photo-form.component.ts
|  |  |     |  |  |- photo-form.component.html
|  |  |     |  |  |- photo-form.component.css
|  |  |     |  |- photo-list/
|  |  |     |     |- photo-list.component.ts
|  |  |     |     |- photo-list.component.html
|  |  |     |     |- photo-list.component.css
|  |  |     |- pages/
|  |  |        |- photos-page/
|  |  |           |- photos-page.component.ts
|  |  |           |- photos-page.component.html
|  |  |           |- photos-page.component.css
|  |  |- app.ts
|  |  |- app.html
|  |  |- app.css
|  |  |- app.routes.ts
|  |  |- app.config.ts
|  |- main.ts
|  |- index.html
|  |- styles.css
|- angular.json
|- package.json
|- tsconfig.json
|- tsconfig.app.json
|- tsconfig.spec.json
|- angular-roadmap.txt
```

## App Routes

- `/login`: mock login page.
- `/photos`: list mode (protected by auth guard).
- `/photos/new`: create mode.
- `/photos/:id/edit`: edit mode.

`/` redirects to `/photos`.

The photos feature routes are lazy-loaded from `src/app/features/photos/photos.routes.ts`.

## Mock Auth Credentials

- Username: `demo`
- Password: `demo123`

Notes:
- This is a fake practice flow, not production security.
- On successful login, a mock token is stored in `localStorage`.
- Logout clears mock token/user state.

## List Controls

- Search by title.
- Sort options: newest, oldest, title A-Z, title Z-A.
- Pagination with Previous/Next controls.
- URL query parameter sync:
	- `q` for search text
	- `sort` for sort option
	- `page` for current page

## Structure Explanation

- `src/app/core/models`
Holds TypeScript interfaces/types shared across features, such as `PhotoItem` and `PhotoPayload`.

- `src/app/core/services`
Holds API/data services. `photo-api.service.ts` centralizes all HTTP requests for the photos API.
`auth.service.ts` handles mock login/logout and token state.

- `src/app/core/guards`
App-level route guards.
`auth.guard.ts` protects photos routes and redirects unauthenticated users to `/login`.

- `src/app/core/interceptors`
Holds global HTTP interceptors. `http-status.interceptor.ts` manages request loading state and global API error mapping.
`mock-auth.interceptor.ts` attaches a fake Bearer token when available.

- `src/app/features/auth/pages`
Authentication UI pages.
`login-page` implements the mock sign-in flow and return URL redirect.

- `src/app/features/photos/components`
Reusable UI pieces for the photos feature:
`photo-form` handles create/update inputs and actions.
`photo-list` renders list cards and edit/delete actions.

- `src/app/features/photos/data`
Feature facade/state layer. `photos-facade.service.ts` owns photos state and CRUD side effects using RxJS streams.

- `src/app/features/photos/pages`
Container pages for route-level screens.
`photos-page` owns feature state and coordinates form + list components.

- `src/app/features/photos/guards`
Route guards for the photos feature.
`pending-changes.guard.ts` prevents leaving create/edit routes when the form has unsaved changes.

- `src/app/features/photos/photos.routes.ts`
Feature routing module for photos with route mode data and guard wiring.

- `src/app/app.routes.ts`
Defines app-level routing, default redirect, and lazy loading for the photos feature.

- `src/app/app.ts` and `src/app/app.html`
Root shell of the application. Keeps root clean with `router-outlet` and delegates feature logic to routed pages.

## Performance Notes

- `photo-list` uses `trackBy` to minimize DOM re-rendering for repeated items.
- `photo-list` and `photo-form` use `OnPush` change detection for more efficient updates.

## API Note

This project uses JSONPlaceholder (`https://jsonplaceholder.typicode.com/photos`), which is a mock API.
Create/Update/Delete requests return successful responses, but data is not permanently persisted on the server.

## Why This Structure Is Better

- Easier to scale when adding new features.
- Cleaner separation of concerns.
- Better team collaboration (core vs feature ownership).
- Simpler testing and maintenance.
