# Shared Logic & Utilities

The `src/lib` directory contains shared code used across the application, including data validation schemas and core business logic.

## Data Validation Schemas (`schemas.ts`)

All API input validation is handled by [Zod](https://zod.dev/). These schemas ensure data integrity before it's processed by the backend.

### `loginSchema`

Used for the administrator login form.

- **email**: Must be a valid email format.
- **password**: Must be a non-empty string.

### `registerSchema`

Used for the initial administrator registration form.

- **email**: Must be a valid email format.
- **name**: Must be at least 3 characters long.
- **password**: Must be at least 8 characters long.
- **confirmPassword**: Must exactly match the `password` field.
- **invitationKey**: An optional secret key, potentially used for future multi-admin setups (currently unused as registration is locked after the first user).

## CSV Export (`export-csv.ts`)

This file contains a client-side utility function for exporting poll results.

### `exportToCSV(votes, campaignName)`

- **Description**: Takes an array of vote objects and a campaign name, then generates and triggers the download of a CSV file in the browser.
- **Key Features**:
  - Maps internal mood keys (e.g., `green`, `red`) to human-readable labels (e.g., "Très bien", "Pas bien").
  - Correctly escapes comments containing quotes.
  - Adds a Byte Order Mark (BOM) `\uFEFF` to ensure proper character rendering in spreadsheet software like Excel.
  - Generates a unique, timestamped filename (e.g., `resultats_Q4-Feedback_2025-11-03_14-30.csv`).
