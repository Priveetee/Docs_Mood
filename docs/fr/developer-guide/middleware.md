# Middleware & Protection des Routes

L'application Mood utilise le Middleware de Next.js pour protéger les routes et gérer le contrôle d'accès au plus près de la requête ("at the edge"), avant même qu'elle n'atteigne le code de l'application.

## `src/middleware.ts`

Ce fichier est responsable d'une seule tâche critique : **protéger l'intégralité du tableau de bord d'administration**.

### `matcher`

La portée du middleware est définie par la propriété `config.matcher` :

```ts
export const config = {
  matcher: ["/admin/:path*"],
};
```

Cette configuration garantit que le middleware s'exécutera pour chaque requête vers une URL commençant par `/admin/`.

### Logique

La logique du middleware est simple :

1.  Il utilise l'aide `getSessionCookie` de `better-auth` pour vérifier l'existence d'un cookie de session valide dans la requête entrante.
2.  **Si le cookie n'est pas trouvé**, cela signifie que l'utilisateur n'est pas authentifié. Le middleware le redirige immédiatement vers la page d'accueil (`/`), empêchant tout accès au tableau de bord.
3.  **Si le cookie est trouvé**, le middleware autorise la requête à continuer vers la page d'administration demandée.

Cette approche est très efficace car elle sécurise tout le tableau de bord au niveau du réseau, sans nécessiter de vérifications dans chaque page ou composant individuel.
