# Placement Cell Recruitment Tracking System - Implementation Plan

This plan outlines the required changes to upgrade the existing system with the new Interview Rounds System, Shortlisted Tracking, and Placed Students capabilities.

## User Review Required

> [!IMPORTANT]
> This upgrade requires modifying the existing MongoDB schema and clearing the old data to seed the new schema correctly. The backend logic will be updated to handle nested updates (modifying applicants inside a company). Please review the new components below.

## Open Questions

> [!WARNING]
> 1. Should the "Candidate Detail View" be a completely separate page (`/candidate/:companyId/:applicantId`), or would you prefer a pop-up modal directly on the Shortlisted/Placed tabs to keep navigation simple? (I plan to use a separate page for simplicity, as requested).
> 2. The existing servers are running. I will stop them to apply the new changes and seed the database. Is that acceptable?

## Proposed Changes

---

### Backend Updates

#### [MODIFY] `backend/models/Company.js`
- Expand `applicantSchema` to include:
  - `rounds`: Array representing the 3 rounds (Coding, Technical, HR) with `status` and `marks`.
  - `currentRound`: Number (0-2) indexing the active round.
  - `isShortlisted`: Boolean flag.
  - `baseOffer`: Number for the package.
  - `offerStatus`: String (Pending, Accepted, Rejected, Revoked).

#### [MODIFY] `backend/controllers/companyController.js`
- Add `updateApplicantRound`: Finds the company and applicant, updates the specific round's status. If "Passed", increments `currentRound`. If passed HR round, sets `isShortlisted = true`.
- Add `updateApplicantOffer`: Updates `baseOffer` and `offerStatus` for a shortlisted applicant.
- Add `getShortlisted`: Aggregates and returns all applicants where `isShortlisted === true`.
- Add `getPlaced`: Aggregates and returns all applicants where `offerStatus === 'Accepted'`.

#### [MODIFY] `backend/routes/companyRoutes.js`
- Map the new endpoints:
  - `PUT /:cid/applicants/:aid/round`
  - `PUT /:cid/applicants/:aid/offer`
  - `GET /shortlisted/all`
  - `GET /placed/all`

#### [MODIFY] `backend/seed.js`
- Update the seed data to align with the new applicant schema (initializing the 3 rounds properly).

---

### Frontend Updates

#### [MODIFY] `frontend/src/App.jsx`
- Add navigation links for "Shortlisted" and "Placed" in the Navbar.
- Map new routes (`/shortlisted`, `/placed`, `/candidate/:cid/:aid`).

#### [MODIFY] `frontend/src/pages/Dashboard.jsx`
- Update logic to calculate and display the total number of placed students (`offerStatus === 'Accepted'`).

#### [MODIFY] `frontend/src/pages/CompanyDetails.jsx`
- In the "Eligible Applicants" section, display the current interview round status.
- Add "Pass" and "Fail" buttons next to candidates in the interview pipeline to trigger the `updateRound` API.

#### [NEW] `frontend/src/pages/Shortlisted.jsx`
- Fetches all shortlisted candidates.
- Displays a table with options to set/edit the `baseOffer` and a dropdown to select `offerStatus`.
- Contains "View Details" button.

#### [NEW] `frontend/src/pages/Placed.jsx`
- Fetches and displays final placed students (Name, Company, Final Package).

#### [NEW] `frontend/src/pages/CandidateDetails.jsx`
- Displays granular details of a specific candidate, showing all 3 rounds, their individual statuses, and marks.

#### [MODIFY] `frontend/src/index.css`
- Add some new styling classes for the interactive buttons, forms, and the round-tracking UI elements.

## Verification Plan

### Automated Tests
N/A (Not required for academic submission).

### Manual Verification
1. Re-run `node seed.js` to populate the new schema.
2. Ensure Dashboard correctly shows 0 placed students initially.
3. Open a company, click "Pass" for an eligible student through all 3 rounds.
4. Verify the student appears on the "Shortlisted Candidates" tab.
5. In "Shortlisted Candidates", assign a Base Offer and change status to "Accepted".
6. Verify the student moves to the "Final Placed Students" tab.
7. Verify the Dashboard metric updates to 1 Placed Student.
