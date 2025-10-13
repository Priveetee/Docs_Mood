# Installation du Projet

Ce guide vous expliquera les étapes pour lancer le projet Mood sur votre machine locale à des fins de **développement**. Pour les instructions de déploiement, veuillez consulter le fichier [README.md](https://github.com/Priveetee/Mood/blob/main/README.md) principal.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre système :

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)

## 1. Cloner le Dépôt

Tout d'abord, clonez le dépôt du projet sur votre machine locale.

```bash
git clone https://github.com/Priveetee/Mood.git
cd Mood
```

## 2. Installer les Dépendances

Installez toutes les dépendances requises du projet en utilisant Bun.

```bash
bun install
```

## 3. Configurer les Variables d'Environnement

Le projet utilise un fichier `.env` pour sa configuration. Créez votre fichier d'environnement de développement local en copiant l'exemple :

```bash
cp .env.example .env
```

Ouvrez ensuite le fichier `.env`. Les valeurs par défaut pour `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc., sont généralement adaptées au développement local. Cependant, vous **devez** définir les variables suivantes :

- **`JWT_SECRET`** : Générez une chaîne secrète longue et aléatoire pour la sécurité des sessions.
  ```bash
  openssl rand -base64 32
  ```
- **`NEXT_PUBLIC_APP_URL`** : Définissez cette variable à `http://localhost:3000` pour le développement local.

## 4. Démarrer la Base de Données

Le projet nécessite une base de données PostgreSQL. Le fichier `docker-compose.yml` fourni est configuré pour démarrer uniquement le service de base de données pour le développement local.

```bash
docker-compose up -d postgres
```

Cette commande démarre **uniquement le service `postgres`** en arrière-plan, laissant l'application être exécutée localement.

## 5. Appliquer les Migrations de la Base de Données

Une fois la base de données en cours d'exécution, appliquez le schéma Prisma pour créer les tables nécessaires.

```bash
bunx prisma migrate dev
```

Cela synchronisera le schéma de votre base de données avec les modèles définis dans `prisma/schema.prisma`.

## 6. Lancer le Serveur de Développement

Vous êtes maintenant prêt à démarrer le serveur de développement Next.js sur votre machine hôte.

```bash
bun run dev
```

L'application devrait maintenant être en cours d'exécution et accessible à l'adresse [http://localhost:3000](http://localhost:3000).
