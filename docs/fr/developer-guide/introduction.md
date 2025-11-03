# Introduction

Bienvenue dans la documentation développeur pour le projet **Mood**. Ce guide offre une analyse détaillée de l'architecture, des outils et des conventions utilisés dans cette application.

## Objectif du Projet

Mood est une plateforme de sondage auto-hébergeable conçue pour que les équipes puissent recueillir des retours de manière anonyme. Elle permet à un administrateur unique de créer des campagnes et de distribuer des liens de sondage uniques à des managers ou des équipes, garantissant que toutes les réponses restent non traçables à l'individu.

## Stack Technique

Le projet est construit sur une stack moderne et entièrement typée, de la base de données jusqu'au frontend :

- **Framework** : [Next.js](https://nextjs.org/) 15 (App Router) avec Turbopack
- **API** : [tRPC](https://trpc.io/) pour des API typées de bout en bout
- **Base de Données** : [PostgreSQL](https://www.postgresql.org/)
- **ORM** : [Prisma](https://www.prisma.io/) pour l'accès à la base de données et les migrations
- **Authentification** : [Better Auth](https://github.com/Thorn-Services/better-auth) pour la gestion des sessions, configuré pour un système à administrateur unique
- **UI** : [Tailwind CSS](https://tailwindcss.com/) avec des composants [shadcn/ui](https://ui.shadcn.com/)
- **Validation** : [Zod](https://zod.dev/) pour la validation des schémas sur les inputs de l'API

## Vue d'Ensemble de l'Architecture

L'application suit une structure monolithique et full-stack au sein du framework Next.js. La communication entre le client et le serveur est principalement gérée par tRPC.

### Flux d'une Requête

Une requête de données typique suit ce chemin :

1.  Un Composant Client (ex: dans `src/app/admin/`) utilise un hook tRPC de `@/lib/trpc/client` pour appeler une procédure de l'API (ex: `trpc.campaign.list.useQuery()`).
2.  Le `TRPCProvider` (dans `src/lib/trpc/provider.tsx`) envoie une requête HTTP groupée au point d'accès `/api/trpc`. Les données sont sérialisées avec `superjson`.
3.  La route d'API de Next.js (`src/app/api/trpc/[trpc]/route.ts`) transmet la requête au routeur tRPC principal.
4.  Le contexte tRPC (`src/server/context.ts`) est créé pour la requête, injectant le client `prisma` et la `session` utilisateur (récupérée via `better-auth`).
5.  Si la procédure est une `protectedProcedure` (`src/server/trpc.ts`), elle vérifie la session de l'utilisateur. Si elle est invalide, elle lève une erreur `UNAUTHORIZED`.
6.  La procédure du routeur correspondant (ex: dans `src/server/routers/campaign.ts`) exécute sa logique, en utilisant le client Prisma pour interagir avec la base de données.
7.  La réponse est retournée au client, entièrement typée et prête à l'emploi.
