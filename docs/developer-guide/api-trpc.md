# API Routes (tRPC)

The entire backend API is built using [tRPC](https://trpc.io/), providing end-to-end typesafe APIs. All API logic is located in `src/server/routers/`. This document details each procedure and its role within the application.

## Structure

The API is namespaced into logical routers:

- `auth`: Handles initial setup and authentication checks.
- `campaign`: Manages the lifecycle of campaigns and their poll links.
- `poll`: Handles public-facing interactions for voting.
- `results`: Provides aggregated data for the results dashboard.

Procedures are either `protectedProcedure` (requiring an authenticated user) or `procedure` (public).

---

## `authRouter`

### `auth.canRegister`

- **Type**: `Query`
- **Access**: Public
- **Description**: Checks if any user exists in the database. This is a critical security and UX feature.
- **Frontend Usage**: Called by `LoginForm.tsx` using the `publicTrpc` client. The result determines if the "Sign Up" tab is rendered, effectively allowing registration only for the very first administrator.
- **Input**: `void`
- **Output**: `{ canRegister: boolean; }`

---

## `campaignRouter`

### `campaign.list`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Retrieves all campaigns for the logged-in user, including aggregated stats. It has a side effect of auto-archiving any campaigns whose expiration date has passed.
- **Frontend Usage**: This is the main data source for the `ActiveCampaignsPage.tsx`. The fetched data populates the campaigns table, showing name, vote counts, participation rates, etc.
- **Input**: `void`
- **Output**: `Array<{ id: number; name: string; managerCount: number; ... }>`

### `campaign.getLinks`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches all poll links for a single, specified campaign.
- **Frontend Usage**: Called conditionally in `ActiveCampaignsPage.tsx` when the user opens the "Manage Links" dialog. The query is enabled only when a `selectedCampaignId` is set.
- **Input**: `number` (The `campaignId`)
- **Output**: `Array<{ id: string; managerName: string; url: string; }>`

### `campaign.addManager`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Adds a new manager and a unique poll link to an existing campaign.
- **Frontend Usage**: Called from the "Add Manager" dialog within `ActiveCampaignsPage.tsx`. On success, it invalidates the `campaign.list` and `campaign.getLinks` queries via `useUtils` to ensure the UI updates instantly.
- **Input**: `{ campaignId: number; managerName: string; }`
- **Output**: `{ id: string; managerName: string; url: string; }`

### `campaign.setArchiveStatus`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Toggles the `archived` status of a campaign.
- **Frontend Usage**: Called from the "Archive"/"Restore" action in the `DropdownMenu` on the `ActiveCampaignsPage.tsx`. On success, it invalidates the `campaign.list` query to refresh the table.
- **Input**: `{ campaignId: number; archived: boolean; }`
- **Output**: `{ success: boolean; archived: boolean; }`

### `campaign.create`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Creates a new campaign and batch-creates all its initial poll links.
- **Frontend Usage**: This is the core mutation on `NewCampaignPage.tsx`. On success, it returns the generated links, which causes the UI to switch from the form view to the results view displaying the new links.
- **Input**: `{ name: string; managers: string[]; expiresAt?: Date; }`
- **Output**: `{ campaignId: number; campaignName: string; generatedLinks: Array<{...}> }`

---

## `pollRouter`

### `poll.getInfoByToken`

- **Type**: `Query`
- **Access**: Public
- **Description**: Retrieves the public-facing name of a campaign and manager for a given poll token.
- **Frontend Usage**: Called on `PollClientPage.tsx` using the `publicTrpc` client. The result is used to display context to the user (e.g., "Poll for John Doe's team (Campaign: Q4 Feedback)"). If the query fails, the user is redirected to the `/poll/closed` page.
- **Input**: `string` (The `pollToken`)
- **Output**: `{ managerName: string; campaignName: string; }`

### `poll.submitVote`

- **Type**: `Mutation`
- **Access**: Public
- **Description**: Records a new vote for a given poll.
- **Frontend Usage**: The main action on `PollClientPage.tsx`. It is called when the user submits the form. On success, it provides feedback via a toast notification.
- **Input**: `{ pollToken: string; mood: "green" | "blue" | ...; comment?: string; }`
- **Output**: `{ message: string; voteId: number; }`

---

## `resultsRouter`

### `results.getCampaignOptions`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches a simplified list of the user's campaigns.
- **Frontend Usage**: Used on the `GlobalResultsClient` page to populate the campaign selection dropdown in the `FilterBar` component.
- **Input**: `void`
- **Output**: `Array<{ id: number; name: string; }>`

### `results.getManagerOptions`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches a distinct list of manager names based on the selected campaign(s).
- **Frontend Usage**: Used on the `GlobalResultsClient` page to populate the manager selection dropdown in the `FilterBar`. The list dynamically updates when the campaign filter is changed.
- **Input**: `{ campaignId: number | "all"; }`
- **Output**: `Array<string>`

### `results.getFilteredResults`

- **Type**: `Query`
- **Access**: Protected
- **Description**: The main data-aggregation endpoint for the dashboard. It fetches and processes votes based on campaign, manager, and date filters.
- **Frontend Usage**: This is the primary data source for `GlobalResultsClient`. The extensive output object provides all the necessary data to render the `MoodChart`, `CommentsList`, and `StatsCards` components.
- **Input**: `{ campaignId: number | "all"; managerName: string | "all"; dateRange: {...}; }`
- **Output**: A large object containing `totalVotes`, `moodDistribution`, `comments`, etc.
