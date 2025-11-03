# Authentification

L'authentification dans le projet Mood est une pièce maîtresse de son modèle de sécurité, construite autour d'un **design à administrateur unique**. Elle est gérée par la librairie `better-auth`, configurée avec une logique personnalisée pour appliquer cette exigence spécifique.

## Logique d'Administrateur Unique (`src/auth.ts`)

Le cœur du système d'authentification se trouve dans `src/auth.ts`. Un `databaseHooks` est utilisé pour intercepter le processus de création d'utilisateur :

- **`user.create.before`** : Avant qu'un nouvel utilisateur ne soit créé, ce hook exécute une requête pour vérifier le nombre total d'utilisateurs dans la base de données.
- **Si `userCount` est supérieur à 0**, la création est rejetée avec une erreur.
- Cela garantit qu'une fois que le premier compte administrateur est créé, **aucun autre compte ne pourra jamais être enregistré**.

## Le Flux d'Inscription

Le frontend s'adapte intelligemment à cette règle d'administrateur unique.

1.  **Le Layout `(auth)`** : La page `/login` est enveloppée par `src/app/(auth)/layout.tsx`. Cette mise en page fournit un `PublicTRPCProvider`, qui est essentiel pour que le formulaire de connexion puisse effectuer des appels d'API publics.

2.  **Endpoint `auth.canRegister`** : L'`authRouter` expose une requête publique `canRegister`. Cet endpoint retourne simplement `true` si le nombre d'utilisateurs est de 0, et `false` sinon.

3.  **UI Conditionnelle dans `LoginForm.tsx`** : Le formulaire de connexion appelle `publicTrpc.auth.canRegister.useQuery()`. Le résultat de ce hook est utilisé pour afficher conditionnellement l'onglet "Sign Up". Si `canRegister` est `false`, l'onglet est masqué et seul le formulaire de connexion est disponible.

## Gestion de Session & Intégration tRPC

La session de l'utilisateur est rendue disponible aux procédures tRPC via le **contexte** tRPC.

Le contexte est créé pour chaque requête dans `src/server/context.ts`. Il utilise `auth.api.getSession()` de `better-auth` pour récupérer la session actuelle. Si une session valide existe, elle est attachée au contexte.

## Protéger les Procédures de l'API (`protectedProcedure`)

Pour restreindre l'accès, nous utilisons une `protectedProcedure` définie dans `src/server/trpc.ts`. Ce middleware personnalisé effectue les actions suivantes :

1.  Il vérifie si `ctx.session` et `ctx.session.user` existent.
2.  Si la session est manquante, il lève une erreur `UNAUTHORIZED`, empêchant la procédure de s'exécuter.
3.  Si la session est présente, il rend les détails de l'utilisateur (comme `ctx.session.user.id`) disponibles à la logique de la procédure.

Cette approche à plusieurs niveaux — combinant une règle de base de données, une interface utilisateur conditionnelle et une protection de l'API côté serveur — crée un système d'administrateur unique robuste et sécurisé.
