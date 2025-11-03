# Core Frontend Patterns

This page details the common patterns used throughout the frontend for data fetching, state management, and user feedback.

## Data Fetching with tRPC Hooks

All communication with the backend API is handled through React Query hooks provided by tRPC. This provides a robust and typesafe way to manage server state.

- **`useQuery`**: Used for fetching data. The `trpc.campaign.list.useQuery()` hook in `ActiveCampaignsPage` is a prime example. It automatically handles caching, refetching, and provides `isLoading` and `isError` states.
- **`useMutation`**: Used for creating, updating, or deleting data. The `trpc.campaign.create.useMutation()` hook in `NewCampaignPage` demonstrates its use. Mutations provide `onSuccess` and `onError` callbacks, which are systematically used to display feedback to the user via toasts.
- **`useUtils`**: The tRPC utility hook is used for cache invalidation. After a successful mutation (e.g., adding a new manager), `utils.campaign.list.invalidate()` is called. This tells tRPC to refetch the campaign list, ensuring the UI is always up-to-date without a manual page refresh.

## State Management

Application state is managed locally within components using React hooks (`useState`, `useEffect`). There is no global state manager, as tRPC's cache handles server state, and UI state is co-located with the components that need it.

- **UI State**: Managing the visibility of dialogs (`isLinksDialogOpen`), toggles (`showArchived`), or animations.
- **Form State**: Handling user input in forms before submission, such as in `NewCampaignPage` (`campaignName`, `managers`). For more complex forms like `LoginForm`, `react-hook-form` is used for performance and validation.

## User Feedback

Consistent user feedback is a core principle of the application's UX.

- **Toasts (`sonner`)**: Every mutation provides immediate feedback to the user, whether it succeeds or fails, by showing a toast notification.
- **Loading States**: Components display loading indicators (spinners, disabled buttons) while queries or mutations are in progress (e.g., `isLoading`, `isPending`). This prevents duplicate submissions and informs the user that an action is underway.

## Component Library & Composition

The UI is built using a custom component library based on **shadcn/ui**. All reusable UI primitives (Button, Card, Input, etc.) are located in `src/components/ui`.

Pages are then constructed by composing these primitives into larger, feature-specific components (e.g., `MoodChart`, `FilterBar`), which are themselves composed to build the final page. This creates a highly maintainable and consistent user interface.
