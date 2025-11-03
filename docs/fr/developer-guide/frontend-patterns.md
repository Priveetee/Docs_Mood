# Patterns Frontend Essentiels

Cette page détaille les schémas de conception courants utilisés dans le frontend pour la récupération des données, la gestion de l'état et les retours utilisateur.

## Récupération de Données avec les Hooks tRPC

Toute la communication avec l'API backend est gérée via les hooks React Query fournis par tRPC. Cela offre un moyen robuste et typé de gérer l'état du serveur.

- **`useQuery`** : Utilisé pour récupérer des données. Le hook `trpc.campaign.list.useQuery()` dans `ActiveCampaignsPage` en est un excellent exemple. Il gère automatiquement la mise en cache, la revalidation et fournit les états `isLoading` et `isError`.
- **`useMutation`** : Utilisé pour créer, mettre à jour ou supprimer des données. Le hook `trpc.campaign.create.useMutation()` dans `NewCampaignPage` en est la parfaite illustration. Les mutations fournissent des callbacks `onSuccess` et `onError`, qui sont systématiquement utilisés pour afficher un retour à l'utilisateur via des toasts.
- **`useUtils`** : L'utilitaire de tRPC est utilisé pour l'invalidation du cache. Après une mutation réussie (ex: l'ajout d'un manager), `utils.campaign.list.invalidate()` est appelé. Cela indique à tRPC de rafraîchir la liste des campagnes, assurant que l'interface est toujours à jour sans rechargement de page.

## Gestion de l'État

L'état de l'application est géré localement dans les composants à l'aide des hooks React (`useState`, `useEffect`). Il n'y a pas de gestionnaire d'état global, car le cache de tRPC gère l'état du serveur, et l'état de l'interface est localisé avec les composants qui en ont besoin.

- **État de l'UI** : Gérer la visibilité des boîtes de dialogue (`isLinksDialogOpen`), des interrupteurs (`showArchived`), ou des animations.
- **État des Formulaires** : Gérer les entrées utilisateur dans les formulaires avant soumission, comme dans `NewCampaignPage` (`campaignName`, `managers`). Pour les formulaires plus complexes comme `LoginForm`, `react-hook-form` est utilisé pour la performance et la validation.

## Retour Utilisateur

Un retour utilisateur cohérent est un principe fondamental de l'UX de l'application.

- **Toasts (`sonner`)** : Chaque mutation fournit un retour immédiat à l'utilisateur, qu'elle réussisse ou échoue, en affichant une notification.
- **États de Chargement** : Les composants affichent des indicateurs de chargement (spinners, boutons désactivés) pendant que les requêtes ou mutations sont en cours (ex: `isLoading`, `isPending`). Cela empêche les soumissions multiples et informe l'utilisateur qu'une action est en cours.

## Bibliothèque de Composants & Composition

L'interface est construite à l'aide d'une bibliothèque de composants personnalisée basée sur **shadcn/ui**. Toutes les primitives d'interface réutilisables (Button, Card, Input, etc.) se trouvent dans `src/components/ui`.

Les pages sont ensuite construites en composant ces primitives en composants plus grands et spécifiques à une fonctionnalité (ex: `MoodChart`, `FilterBar`), qui sont eux-mêmes composés pour construire la page finale. Cela crée une interface utilisateur très maintenable et cohérente.
