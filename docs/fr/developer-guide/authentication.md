# Authentification

L'authentification dans le projet Mood est gérée par la librairie `better-auth`, une solution d'authentification moderne pour Next.js. Elle prend en charge les sessions utilisateur, les identifiants et fournit la base pour sécuriser les points d'accès de l'API.

## Fichiers de Configuration Clés

La logique d'authentification est principalement configurée dans deux fichiers essentiels :

1.  **`src/auth.ts`** : C'est le fichier de configuration principal pour `better-auth`. Il définit les stratégies d'authentification (par exemple, le `credentials provider` pour la connexion par email/mot de passe), les paramètres de gestion de session (stratégie JWT, etc.) et les callbacks.

2.  **`src/app/api/auth/[...all]/route.ts`** : Ce fichier crée les points d'API requis par `better-auth` (ex: `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`). Il se contente d'exporter les gestionnaires depuis la configuration principale dans `src/auth.ts`.

## Intégration avec tRPC

La session de l'utilisateur est rendue disponible aux procédures tRPC via le **contexte** tRPC.

Le contexte est un objet spécial auquel chaque procédure tRPC a accès. Il est créé pour chaque requête entrante dans le fichier `src/server/context.ts`. Dans ce fichier, nous utilisons la fonction `auth()` de `better-auth` pour récupérer la session actuelle à partir des en-têtes de la requête.

Si une session valide existe, l'objet `session` est attaché au contexte. Sinon, `session` est `null`.

## Protéger les Procédures de l'API

Pour restreindre l'accès à certains points d'accès de l'API, nous utilisons une `protectedProcedure`. C'est un middleware tRPC personnalisé défini dans `src/server/trpc.ts`.

La `protectedProcedure` effectue les actions suivantes :

1.  Elle vérifie si `ctx.session` et `ctx.session.user` existent dans le contexte.
2.  Si la session est manquante, elle lève automatiquement une `TRPCError` avec le code `UNAUTHORIZED`, empêchant la logique de la procédure de s'exécuter.
3.  Si la session est présente, elle continue et rend l'objet `session` disponible à la procédure, y compris l'ID de l'utilisateur (`ctx.session.user.id`).

### Exemple d'Utilisation

Voici comment une procédure protégée est définie dans un routeur tRPC :

```ts
import { protectedProcedure, router } from "../trpc";

export const campaignRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Nous pouvons accéder à ctx.session.user en toute sécurité ici
    const campaigns = await ctx.prisma.campaign.findMany({
      where: { createdBy: ctx.session.user.id },
    });
    return campaigns;
  }),
});
```

Toute procédure construite avec `protectedProcedure` au lieu de `procedure` nécessitera une session utilisateur valide pour être accessible.
