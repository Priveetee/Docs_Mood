# Database & Prisma Schema

The `prisma/schema.prisma` file is the single source of truth for the application's data structure. This page provides a detailed breakdown of each model, its fields, and its relationships.

## Authentication Models

These models are primarily managed by the `better-auth` library to handle user identity and sessions.

### `User`

Represents an administrator account. The application is designed for a single administrator.

| Field       | Type     | Description                                                              |
| :---------- | :------- | :----------------------------------------------------------------------- |
| `id`        | `String` | Unique identifier (CUID). Primary key.                                   |
| `email`     | `String` | The user's unique email address, used for login.                         |
| `password`  | `String` | The hashed password for the user.                                        |
| `campaigns` | `Campaign[]` | A one-to-many relationship linking the user to all campaigns they have created. |

### Other Auth Models (`Account`, `Session`, etc.)

These models are standard `better-auth` requirements for session management, OAuth connections, and verification tokens. Their structure is not critical to the application's core business logic.

---

## Core Business Models

This is the functional heart of the Mood application.

### `Campaign`

The top-level container for a polling event.

| Field       | Type         | Description                                                              |
| :---------- | :----------- | :----------------------------------------------------------------------- |
| `id`        | `Int`        | Auto-incrementing integer. Primary key.                                  |
| `name`      | `String`     | The descriptive name of the campaign (e.g., "Q4 Feedback").              |
| `createdBy` | `String`     | Foreign key linking to a `User.id`.                                      |
| `creator`   | `User`       | The relation to the `User` model. `onDelete: Cascade` ensures that if a user is deleted, all their campaigns are also deleted. |
| `archived`  | `Boolean`    | A flag for soft-deleting campaigns. Defaults to `false`.                 |
| `expiresAt` | `DateTime?`  | An optional date for the campaign to auto-archive.                       |
| `pollLinks` | `PollLink[]` | A one-to-many relationship to all poll links generated for this campaign.    |
| `votes`     | `Vote[]`     | A direct one-to-many relationship with all votes, used for fast global aggregations. |

### `PollLink`

The unique, distributable link for a specific team or manager within a campaign.

| Field         | Type       | Description                                                              |
| :------------ | :--------- | :----------------------------------------------------------------------- |
| `id`          | `String`   | Unique identifier (UUID). Primary key. UUIDs are excellent for non-guessable public identifiers. |
| `campaignId`  | `Int`      | Foreign key linking to a `Campaign.id`.                                  |
| `campaign`    | `Campaign` | The relation to the parent `Campaign`. `onDelete: Cascade` ensures that if a campaign is deleted, all its links are also deleted. |
| `token`       | `String`   | A unique, short, random string (`nanoid(10)`) used as the public part of the poll URL. |
| `managerName` | `String`   | The name of the manager or team associated with this link, used for segmenting results. |
| `votes`       | `Vote[]`   | A one-to-many relationship to all votes submitted through this specific link. |

### `Vote`

The atomic unit of feedback, representing a single anonymous submission.

| Field        | Type         | Description                                                              |
| :----------- | :----------- | :----------------------------------------------------------------------- |
| `id`         | `Int`        | Auto-incrementing integer. Primary key.                                  |
| `pollLinkId` | `String`     | Foreign key linking to a `PollLink.id`. This is crucial for tracking results per manager. |
| `pollLink`   | `PollLink`   | The relation to the `PollLink` used. `onDelete: Cascade` ensures data integrity. |
| `campaignId` | `Int`        | **Denormalized** foreign key to `Campaign.id`. This is a deliberate performance optimization for global aggregation queries, avoiding an extra join through `PollLink`. |
| `campaign`   | `Campaign`   | The direct relation to the `Campaign`.                                   |
| `mood`       | `String`     | The core sentiment value (e.g., "green", "red").                         |
| `comment`    | `String?`    | Optional qualitative feedback provided by the user.                      |

## Logical Relationship Schema

```text
[User] 1--* [Campaign] 1--* [PollLink] 1--* [Vote]
                         ^                      |
                         |______________________|
             (A Vote is also directly linked to the Campaign for performance)
```
