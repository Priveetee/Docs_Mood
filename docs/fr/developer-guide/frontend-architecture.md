# Architecture Frontend

Le frontend est construit avec Next.js 15 et le App Router, offrant une structure claire et évolutive pour le routage, les mises en page et le rendu des composants.

## Structure du App Router

Le répertoire `src/app` suit les conventions du App Router, où les dossiers définissent les routes.

- **/admin** : C'est un groupe de routes contenant toutes les pages protégées du tableau de bord de l'administrateur. Sa structure est protégée par le fichier `middleware.ts`.
- **/(auth)** : C'est un groupe de routes pour les pages liées à l'authentification comme `/login`. Les parenthèses indiquent que `(auth)` ne fait pas partie de l'URL, ce qui permet d'avoir une mise en page partagée pour ces pages sans affecter l'URL.
- **/poll** : Ce groupe contient les pages publiques où les utilisateurs votent.

## Mises en page (`layout.tsx`)

Les layouts sont utilisés pour créer une interface utilisateur cohérente sur plusieurs pages.

- **`src/app/layout.tsx` (Root Layout)** : La mise en page principale pour toute l'application. Elle configure la structure HTML, les polices de caractères et le `ThemeProvider` pour le mode clair/sombre.
- **`src/app/(auth)/layout.tsx` (Auth Layout)** : Cette mise en page enveloppe les pages d'authentification et fournit le `PublicTRPCProvider`, activant les requêtes tRPC sur les routes publiques comme la page de connexion.
- **`src/app/admin/layout.tsx` (Admin Layout)** : Cette mise en page enveloppe toutes les pages de la route `/admin`. Elle fournit le `TRPCProvider` authentifié, rendant les hooks tRPC protégés disponibles pour tous les composants de l'administration.

## Pattern "Coquille Serveur" (Server Component Shell)

Pour les pages interactives complexes, le projet utilise un pattern où un Composant Serveur agit comme une "coquille" pour un Composant Client principal. C'est une bonne pratique qui tire parti des forces des deux types de composants.

- **`page.tsx` (Coquille Serveur)** : Ce fichier est un Composant Serveur. Son rôle principal est de gérer les aspects côté serveur, comme envelopper le composant principal dans une balise `<Suspense>` de React pour permettre le streaming de l'UI et fournir un état de chargement instantané.
- **`client-page.tsx` (Noyau Client)** : Ce fichier contient la directive `"use client";` et abrite toute la logique interactive de la page. Il gère l'état, les événements utilisateur et récupère les données à l'aide des hooks tRPC.

Ce pattern est notamment utilisé dans la page des résultats globaux (`src/app/admin/results/global/`). D'autres pages, comme la page de sondage publique, sont implémentées en tant que Composants Clients uniques et autonomes.
