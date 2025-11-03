# Introduction

Bienvenue dans la documentation développeur pour le projet **Mood**. Ce guide offre une analyse détaillée de l'architecture, des choix techniques et des principes fondamentaux qui définissent cette application.

## Objectif du Projet

Mood est une plateforme de sondage auto-hébergeable conçue pour que les équipes puissent recueillir des retours, avec un accent mis sur **un anonymat total et un modèle de sécurité à administrateur unique**. Elle permet à un seul admin de créer des campagnes et de distribuer des liens de sondage uniques à des managers, garantissant que toutes les réponses restent non traçables.

## Principes Architecturaux Clés

L'application est construite sur plusieurs principes clés qui guident sa structure et son développement :

1.  **Typage de Bout en Bout** : En combinant Next.js, tRPC, Zod et Prisma, l'intégralité du flux de données est fortement typée. Cela élimine une classe massive de bugs potentiels entre le frontend et le backend et offre une expérience de développement exceptionnelle avec l'autocomplétion.

2.  **Défense en Profondeur** : L'application emploie un modèle de sécurité à plusieurs niveaux :
    - **Protection "Edge"** : Un fichier `middleware.ts` protège l'ensemble du groupe de routes `/admin` au niveau du réseau, redirigeant les utilisateurs non authentifiés avant même le rendu de tout code applicatif.
    - **Protection de l'API** : Chaque point d'accès sensible de l'API est une `protectedProcedure`, vérifiant la session de l'utilisateur sur le serveur pour chaque requête.
    - **Modèle à Admin Unique** : La logique d'authentification (`src/auth.ts`) est conçue pour n'autoriser l'inscription que pour le tout premier utilisateur, sécurisée par une `INVITATION_KEY` obligatoire.

3.  **Expérience Utilisateur Optimisée** : L'architecture est conçue pour être rapide et réactive.
    - **Pattern "Coquille Serveur"** : Les pages complexes utilisent une coquille de Composant Serveur pour permettre un chargement instantané et le streaming de l'UI via React Suspense, tandis qu'un Composant Client principal gère toute l'interactivité.
    - **Feedback Constant** : Chaque action de l'utilisateur (en particulier les mutations) fournit un retour visuel immédiat via des toasts et des états de chargement, garantissant que l'utilisateur n'est jamais laissé dans l'incertitude.

## Stack Technique

- **Framework** : Next.js 15 (App Router) avec Turbopack
- **API** : tRPC (pour des API typées de bout en bout)
- **Base de Données** : PostgreSQL avec l'ORM Prisma
- **Authentification** : Better Auth (configuré pour un système à admin unique)
- **UI** : Tailwind CSS avec des composants shadcn/ui
- **Visuels** : Shaders WebGL personnalisés via `react-three-fiber` & `ogl`
- **Validation** : Zod (pour la validation des entrées de l'API)

## Flux de Données de l'Application

Une requête typique vers une page protégée suit ce parcours complet :

1.  Un utilisateur tente d'accéder à une URL d'administration (ex: `/admin/campaigns/active`).
2.  Le **Middleware Next.js** (`src/middleware.ts`) intercepte la requête et vérifie le cookie de session. S'il est invalide, il redirige vers `/login`.
3.  La requête continue. React effectue le rendu de la page, en commençant par le **Root Layout** et l'**Admin Layout**.
4.  L'`AdminLayout` enveloppe la page dans un `TRPCProvider`, rendant le client tRPC authentifié disponible.
5.  Le Composant Client de la page (ex: `ActiveCampaignsPage.tsx`) s'initialise et appelle un hook tRPC, comme `trpc.campaign.list.useQuery()`.
6.  Le client tRPC envoie une requête HTTP à la route d'API `/api/trpc`. Les données sont sérialisées avec `superjson`.
7.  Le **Contexte tRPC** (`src/server/context.ts`) est créé sur le serveur, injectant le client `prisma` et la `session` utilisateur à la requête.
8.  La `protectedProcedure` dans `src/server/trpc.ts` exécute son propre middleware, validant que `ctx.session.user` existe.
9.  La logique du routeur dans `src/server/routers/campaign.ts` s'exécute enfin, utilisant Prisma pour interroger la base de données.
10. La réponse, entièrement typée, est retournée au client, où React Query gère la mise en cache et le rendu des données.
