# Database & Prisma Schema

The Mood project's data persistence is handled by a PostgreSQL database, with all interactions managed through the [Prisma](https://www.prisma.io/) ORM. The `prisma/schema.prisma` file is the single source of truth for the data structure.

## Authentication Models

These models are primarily managed by the `better-auth` library and handle user and session management.

- **User**: Represents an application user, typically an administrator who creates and manages campaigns.
- **Account**: Used for OAuth provider connections (e.g., Google, GitHub).
- **Session**: Stores active user session information.
- **VerificationToken** / **Verification**: Used for verification processes like email confirmation.

## Core Business Models

This is the functional heart of the Mood application.

### `Campaign`

A `Campaign` is the main container for a set of polls.

- **Purpose**: To group votes for a specific event or period (e.g., "Sprint 22 Feedback," "Q4 Satisfaction").
- **Key Fields**:
  - `name`: The campaign's display name.
  - `createdBy` / `creator`: A direct relationship to the `User` who created the campaign.
  - `expiresAt`: An optional date when the campaign ends and no longer accepts votes.
  - `archived`: A boolean to hide old campaigns from the main interface.

### `PollLink`

The `PollLink` is the unique link distributed to individuals whose feedback is being collected.

- **Purpose**: To allow response segmentation within a single campaign. A campaign can have multiple `PollLink`s.
- **Key Fields**:
  - `token`: A unique and secret identifier used in the URL.
  - `managerName`: Associates a link with a specific person, team, or department.
  - `campaignId`: The parent campaign.

### `Vote`

A `Vote` is the atomic unit of data, representing the feedback submitted by an end-user.

- **Purpose**: To record a person's sentiment and comments at a specific moment.
- **Key Fields**:
  - `mood`: The sentiment value (e.g., "happy", "neutral", "sad").
  - `comment`: An optional text field for qualitative feedback.
  - `pollLinkId`: The ID of the link through which the vote was submitted.
  - `campaignId`: The ID of the parent campaign. This relationship is denormalized to optimize the performance of aggregation queries.

## Logical Relationship Schema

```text
[User] 1--* [Campaign] 1--* [PollLink] 1--* [Vote]
                         ^                      |
                         |______________________|
             (A Vote is also directly linked to the Campaign for performance)
```
