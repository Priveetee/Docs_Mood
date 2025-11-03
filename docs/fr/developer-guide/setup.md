# Installation du Projet

Ce guide couvre deux scénarios principaux : le développement local rapide et le workflow de contribution requis pour soumettre des modifications.

## Développement Local Rapide

Cette méthode est idéale pour le développement rapide de fonctionnalités ou le débogage. Elle exécute le serveur de développement Next.js sur votre machine hôte et se connecte à une base de données PostgreSQL dans Docker.

### Prérequis

- [Git](https://git-scm.com/), [Bun](https://bun.sh/), [Docker](https://www.docker.com/)

### Étapes

1.  **Cloner & Installer**:
    ```bash
    git clone https://github.com/Priveetee/Mood.git
    cd Mood
    bun install
    ```
2.  **Configurer l'Environnement**:
    ```bash
    cp .env.example .env
    ```
    Assurez-vous que `NEXT_PUBLIC_APP_URL` est défini sur `http://localhost:3000` et générez un `JWT_SECRET`.
3.  **Démarrer la Base de Données**:
    ```bash
    docker-compose up -d postgres
    ```
4.  **Appliquer les Migrations**:
    ```bash
    bunx prisma migrate dev
    ```
5.  **Lancer le Serveur de Développement**:
    `bash
    bun run dev
    `
    L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

---

## Workflow de Contribution & Pré-PR (Recommandé)

C'est le workflow **obligatoire** pour soumettre une Pull Request. Il garantit que vos modifications fonctionnent correctement dans un environnement propre, conteneurisé et similaire à la production. Ce processus compile l'application, exécute le linting et détecte les erreurs que votre serveur de développement local pourrait manquer.

### Prérequis

- [Git](https://git-scm.com/), [Docker](https://www.docker.com/)

### Étapes

1.  **Cloner & Configurer**: Suivez les étapes 1 et 2 de l'installation rapide.
2.  **Compiler et Lancer la Stack Complète**:
    ```bash
    docker compose up --build -d
    ```
    Cette unique commande construit l'image de l'application, démarre à la fois le serveur web et la base de données, et applique automatiquement les migrations via le script `entrypoint.sh`.

Si les conteneurs démarrent avec succès, vos modifications sont prêtes à être poussées pour une Pull Request. Pour une explication détaillée de ce processus, consultez la page [Déploiement](./deployment.md).
