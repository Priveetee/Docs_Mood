# API Routes (tRPC)

The entire backend API is built using [tRPC](https://trpc.io/), which provides end-to-end typesafe APIs. All API logic is located in `src/server/routers/`.

## Structure

The main router is `_app.ts`, which merges all other routers into a single, unified API. Each router is namespaced:

- `auth`: Handles authentication-related queries.
- `campaign`: Manages the creation and administration of campaigns.
- `poll`: Handles public-facing poll interactions (fetching info, submitting votes).
- `results`: Provides data for the results dashboard.

Procedures are defined as either `protectedProcedure` (requiring an authenticated user session) or `procedure` (publicly accessible).

---

## `authRouter`

Handles initial setup and authentication checks.

### `auth.canRegister`

- **Type**: `Query`
- **Access**: Public (`procedure`)
- **Description**: Checks if any user exists in the database. This is used by the frontend to determine whether to show a registration form (for the first admin) or a login form.
- **Input**: `void`
- **Output**:
  ```ts
  {
    canRegister: boolean;
  }
  ```

---

## `campaignRouter`

All procedures in this router are protected and require an active user session.

### `campaign.list`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Retrieves a list of all campaigns created by the logged-in user. It first auto-archives any campaigns whose `expiresAt` date has passed, then returns a formatted list with aggregated statistics.
- **Input**: `void`
- **Output**:
  ```ts
  Array<{
    id: number;
    name: string;
    managerCount: number;
    creationDate: string; // Formatted as "DD/MM/YYYY"
    participationRate: number; // Integer from 0 to 100
    totalVotes: number;
    archived: boolean;
  }>;
  ```

### `campaign.getLinks`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches all poll links for a specific campaign.
- **Input**: `number` (The `campaignId`)
- **Output**:
  ```ts
  Array<{
    id: string;
    managerName: string;
    url: string;
  }>;
  ```

### `campaign.addManager`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Adds a new manager and their associated poll link to an existing campaign. It prevents duplicate manager names within the same campaign.
- **Input**:
  ```ts
  {
    campaignId: number;
    managerName: string;
  }
  ```
- **Output**:
  ```ts
  {
    id: string;
    managerName: string;
    url: string;
  }
  ```

### `campaign.setArchiveStatus`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Manually archives or un-archives a campaign.
- **Input**:
  ```ts
  {
    campaignId: number;
    archived: boolean;
  }
  ```
- **Output**:
  ```ts
  {
    success: boolean;
    archived: boolean;
  }
  ```

### `campaign.create`

- **Type**: `Mutation`
- **Access**: Protected
- **Description**: Creates a new campaign and simultaneously generates all its initial poll links from a list of manager names.
- **Input**:
  ```ts
  {
    name: string;
    managers: string[];
    expiresAt?: Date;
  }
  ```
- **Output**:
  ```ts
  {
    campaignId: number;
    campaignName: string;
    generatedLinks: Array<{
      managerName: string;
      url: string;
    }>;
  }
  ```

---

## `pollRouter`

These procedures are public and handle direct interactions with a poll.

### `poll.getInfoByToken`

- **Type**: `Query`
- **Access**: Public
- **Description**: Retrieves public information about a poll using its unique token. This is used on the voting page to display context.
- **Input**: `string` (The `pollToken`)
- **Output**:
  ```ts
  {
    managerName: string;
    campaignName: string;
  }
  ```

### `poll.submitVote`

- **Type**: `Mutation`
- **Access**: Public
- **Description**: Submits a vote for a poll, identified by its token.
- **Input**:
  ```ts
  {
    pollToken: string;
    mood: "green" | "blue" | "yellow" | "red";
    comment?: string;
  }
  ```
- **Output**:
  ```ts
  {
    message: string;
    voteId: number;
  }
  ```

---

## `resultsRouter`

All procedures in this router are protected and are used to populate the results dashboard.

### `results.getCampaignOptions`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches a simplified list of campaigns (id and name) for the user, intended for use in UI select/dropdown components.
- **Input**: `void`
- **Output**:
  ```ts
  Array<{
    id: number;
    name: string;
  }>;
  ```

### `results.getManagerOptions`

- **Type**: `Query`
- **Access**: Protected
- **Description**: Fetches a distinct list of manager names, either for a specific campaign or for all campaigns owned by the user.
- **Input**:
  ```ts
  {
    campaignId: number | "all";
  }
  ```
- **Output**: `Array<string>`

### `results.getFilteredResults`

- **Type**: `Query`
- **Access**: Protected
- **Description**: The primary data-fetching endpoint for the results dashboard. It aggregates and processes votes based on a set of filters and returns a comprehensive payload for visualization.
- **Input**:
  ```ts
  {
    campaignId: number | "all";
    managerName: string | "all";
    dateRange: {
      from?: Date;
      to?: Date;
    };
  }
  ```
- **Output**: A complex object containing all necessary data for the dashboard, including `totalVotes`, `moodDistribution`, `comments`, etc.
