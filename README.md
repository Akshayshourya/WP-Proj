# Placement Cell — Fullstack App

This repository contains a simple placement management application with a Node/Express backend and a React + Vite frontend.

## Repository structure

- `backend/` — Express API, Mongoose models, seed script
- `frontend/` — React (Vite) single-page app

## Quick overview

- Backend: exposes company and applicant tracking endpoints (CRUD, rounds, offers, shortlisted/placed lists).
- Frontend: React app that consumes the backend API and provides views for companies, candidates, and dashboards.

## Prerequisites

- Node.js (v16+ recommended) and npm
- MongoDB running locally (or a connection string to a MongoDB instance)

## Backend — setup & run

1. Open a terminal and change to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. By default the server connects to MongoDB at `mongodb://127.0.0.1:27017/placement-cell`. Ensure MongoDB is running locally or update the connection in `server.js`.

4. (Optional) Seed the database with sample data:

```bash
node seed.js
```

5. Start the backend server:

```bash
node server.js
```

The server listens on `process.env.PORT` or defaults to `5000`.

## Frontend — setup & run

1. Open a separate terminal and change to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

The Vite dev server runs on its default port (usually `5173`). The frontend expects the backend API to be reachable (CORS is enabled in the backend).

## API Endpoints

Base path: `/companies`

- `GET /companies` — list all companies
- `POST /companies` — create a company (request body: company object)
- `GET /companies/:id` — get details for a company
- `GET /companies/:id/eligible` — get eligible applicants for a company
- `PUT /companies/:cid/applicants/:aid/round` — update an applicant's current round (body: `{ status, marks, maxMarks }`)
- `PUT /companies/:cid/applicants/:aid/offer` — update an applicant's offer (body: `{ offerStatus, baseOffer }`)
- `GET /companies/shortlisted/all` — list all shortlisted candidates across companies
- `GET /companies/placed/all` — list all placed candidates across companies

Refer to the route handlers in `backend/routes/companyRoutes.js` and controller logic in `backend/controllers/companyController.js` for implementation details.

## Notes

- Database connection in `backend/server.js` currently points to `mongodb://127.0.0.1:27017/placement-cell`.
- The backend uses `express`, `cors`, and `mongoose`.
- The frontend uses React + Vite and depends on `axios` and `react-router-dom`.

## Contributing

Feel free to open issues or submit PRs. For local development, run backend and frontend concurrently in separate terminals.

## License

This project does not include a license file. Add one if you plan to publish or share.
