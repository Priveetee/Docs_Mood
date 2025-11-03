# Logique Partagée & Utilitaires

Le répertoire `src/lib` contient du code partagé utilisé à travers l'application, y compris les schémas de validation de données et la logique métier de base.

## Schémas de Validation (`schemas.ts`)

Toute la validation des entrées de l'API est gérée par [Zod](https://zod.dev/). Ces schémas garantissent l'intégrité des données avant qu'elles ne soient traitées par le backend.

### `loginSchema`

Utilisé pour le formulaire de connexion de l'administrateur.

- **email** : Doit être un format d'email valide.
- **password** : Doit être une chaîne non vide.

### `registerSchema`

Utilisé pour le formulaire d'inscription initial de l'administrateur.

- **email** : Doit être un format d'email valide.
- **name** : Doit contenir au moins 3 caractères.
- **password** : Doit contenir au moins 8 caractères.
- **confirmPassword** : Doit correspondre exactement au champ `password`.
- **invitationKey** : Une clé secrète obligatoire, définie dans le fichier `.env` (`INVITATION_KEY`). Cette clé doit être fournie lors de l'inscription du premier et unique compte administrateur pour sécuriser la configuration initiale.

## Export CSV (`export-csv.ts`)

Ce fichier contient une fonction utilitaire côté client pour exporter les résultats des sondages.

### `exportToCSV(votes, campaignName)`

- **Description** : Prend un tableau d'objets de vote et un nom de campagne, puis génère et déclenche le téléchargement d'un fichier CSV dans le navigateur.
- **Caractéristiques Clés** :
  - Mappe les identifiants internes d'humeur (ex: `green`, `red`) en libellés lisibles (ex: "Très bien", "Pas bien").
  - Échappe correctement les commentaires contenant des guillemets.
  - Ajoute un indicateur d'ordre des octets (BOM) `\uFEFF` pour assurer un affichage correct des caractères dans les tableurs comme Excel.
  - Génère un nom de fichier unique et horodaté (ex: `resultats_Feedback-Q4_2025-11-03_14-30.csv`).
