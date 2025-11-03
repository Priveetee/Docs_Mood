# Déploiement & Conteneurisation

L'application Mood est conçue pour être déployée comme un ensemble de conteneurs Docker. Cette approche garantit un environnement cohérent et reproductible du développement à la production. Cette page détaille la stratégie de conteneurisation.

## `docker-compose.yml`

Le fichier `docker-compose.yml` orchestre les deux services principaux :

- **`postgres`** : Une image standard `postgres:16-alpine` qui exécute la base de données. Elle utilise un volume nommé (`postgres_data`) pour la persistance des données.
- **`web`** : Le service principal de l'application, construit à partir du `Dockerfile` local.

Une caractéristique clé est le `healthcheck` sur le service `postgres` et la condition `depends_on` dans le service `web`. Cela garantit que le conteneur `web` ne démarrera qu'une fois que la base de données sera entièrement initialisée et prête à accepter les connexions, prévenant ainsi les erreurs de démarrage.

## `Dockerfile`

Le `Dockerfile` utilise un build multi-stage pour créer une image finale légère et optimisée pour la production.

1.  **Étape `deps`** : Installe toutes les dépendances (`dependencies` et `devDependencies`) avec `bun install`. Cette couche est mise en cache par Docker, ce qui accélère les builds suivants si les dépendances n'ont pas changé.
2.  **Étape `builder`** : Copie le code source et les `node_modules` de l'étape précédente, puis exécute `bun run build`. Cela compile l'application Next.js en un output de production optimisé dans le répertoire `.next`.
3.  **Étape `runner`** : C'est l'image finale et allégée. Elle installe **uniquement** les dépendances de production (`bun install --production`), copie les artefacts de build de l'étape `builder`, et met en place le script `entrypoint.sh`.

## `entrypoint.sh`

Ce script est l'`ENTRYPOINT` du conteneur final `runner`. Il effectue des tâches critiques au moment de l'exécution avant de démarrer le serveur de l'application :

1.  **Attendre la Base de Données** : Il entre dans une boucle qui utilise `pg_isready` pour suspendre l'exécution jusqu'à ce que le conteneur `postgres` soit complètement prêt.
2.  **Appliquer les Migrations** : Il exécute `npx prisma migrate deploy`. Cette commande applique toutes les migrations de base de données en attente. Elle peut être exécutée en toute sécurité à chaque démarrage et garantit que le schéma de la base de données est toujours synchronisé avec le schéma Prisma.
3.  **Démarrer l'Application** : Finalement, il exécute `exec bun run start` pour démarrer le serveur de production Next.js.

Cette étape de migration automatisée rend les déploiements et les mises à jour fluides.
