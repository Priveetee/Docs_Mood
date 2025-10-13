# Base de Données & Schéma Prisma

La persistance des données du projet Mood est gérée par une base de données PostgreSQL, et les interactions sont effectuées via l'ORM [Prisma](https://www.prisma.io/). Le fichier `prisma/schema.prisma` est l'unique source de vérité concernant la structure des données.

## Modèles d'Authentification

Ces modèles sont principalement gérés par la librairie `better-auth` et assurent la gestion des utilisateurs et de leurs sessions.

- **User** : Représente un utilisateur de l'application (généralement un administrateur). C'est lui qui crée et gère les campagnes.
- **Account** : Utilisé pour les connexions via des fournisseurs OAuth (ex: Google, GitHub).
- **Session** : Stocke les informations des sessions actives des utilisateurs.
- **VerificationToken** / **Verification** : Utilisés pour les processus de vérification (ex: confirmation d'email).

## Modèles Métier

C'est le cœur fonctionnel de l'application Mood.

### `Campaign`

La `Campaign` est le conteneur principal pour un ensemble de sondages.

- **Objectif** : Regrouper les votes pour un événement ou une période donnée (ex: "Feedback Sprint 22", "Satisfaction Q4").
- **Champs clés** :
  - `name` : Le nom de la campagne.
  - `createdBy` / `creator` : Une relation directe avec le `User` qui a créé la campagne.
  - `expiresAt` : Une date optionnelle à laquelle la campagne se termine et n'accepte plus de votes.
  - `archived` : Un booléen pour masquer les vieilles campagnes de l'interface principale.

### `PollLink`

Le `PollLink` est le lien unique qui est distribué aux personnes dont on veut recueillir l'avis.

- **Objectif** : Permettre de segmenter les réponses au sein d'une même campagne. Une campagne peut avoir de multiples `PollLink`.
- **Champs clés** :
  - `token` : Un identifiant unique et secret pour l'URL.
  - `managerName` : Permet d'associer un lien à une personne, une équipe ou un département spécifique.
  - `campaignId` : La campagne parente.

### `Vote`

Le `Vote` est l'unité de donnée atomique, représentant le feedback soumis par un utilisateur final.

- **Objectif** : Enregistrer le ressenti et le commentaire d'une personne à un instant T.
- **Champs clés** :
  - `mood` : La valeur du sentiment (ex: "happy", "neutral", "sad").
  - `comment` : Un champ texte optionnel pour un feedback qualitatif.
  - `pollLinkId` : L'identifiant du lien via lequel le vote a été soumis.
  - `campaignId` : L'identifiant de la campagne parente. Cette relation est dénormalisée pour optimiser les performances des requêtes d'agrégation.

## Schéma Logique des Relations

```text
[User] 1--* [Campaign] 1--* [PollLink] 1--* [Vote]
                         ^                      |
                         |______________________|
             (Un Vote est aussi lié directement à la Campaign pour la performance)
```
