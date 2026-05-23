# Angular CRUD Practice

A simple Angular practice project that consumes a public test API (JSONPlaceholder Photos) and demonstrates full CRUD flow.

## What This Project Covers

- Read a list of images from a public API.
- Create a new image item.
- Update an existing image item.
- Delete an image item.
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
|  |  |  |- services/
|  |  |     |- photo-api.service.ts
|  |  |- features/
|  |  |  |- photos/
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
```

## Structure Explanation

- `src/app/core/models`
Holds TypeScript interfaces/types shared across features, such as `PhotoItem` and `PhotoPayload`.

- `src/app/core/services`
Holds API/data services. `photo-api.service.ts` centralizes all HTTP requests for the photos API.

- `src/app/features/photos/components`
Reusable UI pieces for the photos feature:
`photo-form` handles create/update inputs and actions.
`photo-list` renders list cards and edit/delete actions.

- `src/app/features/photos/pages`
Container pages for route-level screens.
`photos-page` owns feature state and coordinates form + list components.

- `src/app/app.routes.ts`
Defines app routing and maps the default route to the photos page.

- `src/app/app.ts` and `src/app/app.html`
Root shell of the application. Keeps root clean with `router-outlet` and delegates feature logic to routed pages.

## API Note

This project uses JSONPlaceholder (`https://jsonplaceholder.typicode.com/photos`), which is a mock API.
Create/Update/Delete requests return successful responses, but data is not permanently persisted on the server.

## Why This Structure Is Better

- Easier to scale when adding new features.
- Cleaner separation of concerns.
- Better team collaboration (core vs feature ownership).
- Simpler testing and maintenance.
