# Base de Données & Schéma Prisma

Le fichier `prisma/schema.prisma` est l'unique source de vérité pour la structure des données de l'application. Cette page fournit une analyse détaillée de chaque modèle, de ses champs et de ses relations.

## Modèles d'Authentification

Ces modèles sont principalement gérés par la librairie `better-auth` pour gérer l'identité et les sessions des utilisateurs.

### `User`

Représente un compte administrateur. L'application est conçue pour un administrateur unique.

| Champ       | Type       | Description                                                              |
| :---------- | :--------- | :----------------------------------------------------------------------- |
| `id`        | `String`   | Identifiant unique (CUID). Clé primaire.                                 |
| `email`     | `String`   | L'adresse e-mail unique de l'utilisateur, utilisée pour la connexion.    |
| `password`  | `String`   | Le mot de passe haché de l'utilisateur.                                  |
| `campaigns` | `Campaign[]` | Une relation un-à-plusieurs liant l'utilisateur à toutes les campagnes qu'il a créées. |

### Autres Modèles d'Auth (`Account`, `Session`, etc.)

Ces modèles sont des prérequis standards de `better-auth` pour la gestion des sessions, les connexions OAuth et les jetons de vérification. Leur structure n'est pas critique pour la logique métier de l'application.

---

## Modèles Métier

C'est le cœur fonctionnel de l'application Mood.

### `Campaign`

Le conteneur de plus haut niveau pour un événement de sondage.

| Champ       | Type         | Description                                                              |
| :---------- | :----------- | :----------------------------------------------------------------------- |
| `id`        | `Int`        | Entier auto-incrémenté. Clé primaire.                                    |
| `name`      | `String`     | Le nom descriptif de la campagne (ex: "Feedback Q4").                    |
| `createdBy` | `String`     | Clé étrangère liée à un `User.id`.                                       |
| `creator`   | `User`       | La relation vers le modèle `User`. `onDelete: Cascade` assure que si un utilisateur est supprimé, toutes ses campagnes le sont aussi. |
| `archived`  | `Boolean`    | Un drapeau pour l'archivage (soft-delete) des campagnes. Vaut `false` par défaut. |
| `expiresAt` | `DateTime?`  | Une date optionnelle pour l'auto-archivage de la campagne.               |
| `pollLinks` | `PollLink[]` | Une relation un-à-plusieurs vers tous les liens de sondage générés pour cette campagne. |
| `votes`     | `Vote[]`     | Une relation directe un-à-plusieurs avec tous les votes, utilisée pour des agrégations globales rapides. |

### `PollLink`

Le lien unique et distribuable pour une équipe ou un manager spécifique au sein d'une campagne.

| Champ         | Type       | Description                                                              |
| :------------ | :--------- | :----------------------------------------------------------------------- |
| `id`          | `String`   | Identifiant unique (UUID). Clé primaire. Les UUIDs sont excellents pour les identifiants publics non devinables. |
| `campaignId`  | `Int`      | Clé étrangère liée à un `Campaign.id`.                                   |
| `campaign`    | `Campaign` | La relation vers la `Campaign` parente. `onDelete: Cascade` assure que si une campagne est supprimée, tous ses liens le sont aussi. |
| `token`       | `String`   | Une chaîne courte, unique et aléatoire (`nanoid(10)`) utilisée comme partie publique de l'URL du sondage. |
| `managerName` | `String`   | Le nom du manager ou de l'équipe associé à ce lien, utilisé pour segmenter les résultats. |
| `votes`       | `Vote[]`   | Une relation un-à-plusieurs vers tous les votes soumis via ce lien spécifique. |

### `Vote`

L'unité atomique de feedback, représentant une unique soumission anonyme.

| Champ        | Type         | Description                                                              |
| :----------- | :----------- | :----------------------------------------------------------------------- |
| `id`         | `Int`        | Entier auto-incrémenté. Clé primaire.                                    |
| `pollLinkId` | `String`     | Clé étrangère liée à un `PollLink.id`. Crucial pour le suivi des résultats par manager. |
| `pollLink`   | `PollLink`   | La relation vers le `PollLink` utilisé. `onDelete: Cascade` assure l'intégrité des données. |
| `campaignId` | `Int`        | Clé étrangère **dénormalisée** vers `Campaign.id`. C'est une optimisation de performance délibérée pour les requêtes d'agrégation globales, évitant une jointure supplémentaire via `PollLink`. |
| `campaign`   | `Campaign`   | La relation directe vers la `Campaign`.                                  |
| `mood`       | `String`     | La valeur du sentiment (ex: "green", "red").                             |
| `comment`    | `String?`    | Le feedback qualitatif optionnel fourni par l'utilisateur.               |

## Schéma Logique des Relations

```text
[User] 1--* [Campaign] 1--* [PollLink] 1--* [Vote]
                         ^                      |
                         |______________________|
             (Un Vote est aussi lié directement à la Campaign pour la performance)
```
