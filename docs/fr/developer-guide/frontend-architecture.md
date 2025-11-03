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
- **`src/app/admin/layout.tsx` (Admin Layout)** : C'est une mise en page cruciale qui enveloppe toutes les pages de la route `/admin`. Elle fournit le `TRPCProvider`, rendant les hooks tRPC disponibles pour tous les composants de l'administration. Elle gère également l'arrière-plan animé (`Silk`) et le sélecteur de thème.

## Composants Client & Serveur

L'application utilise massivement les Composants Clients (`"use client";`) pour les pages nécessitant de l'interactivité, un état et des hooks. C'est le cas de toutes les pages du tableau de bord, qui sont riches en interactions utilisateur.

Souvent, un fichier `page.tsx` (qui peut être un Composant Serveur) agit comme une fine couche qui importe et affiche un Composant Client principal (ex: `client-page.tsx`), lequel contient toute la logique interactive. C'est une bonne pratique pour la séparation des responsabilités.
