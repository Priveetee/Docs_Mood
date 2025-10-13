# Routes API (tRPC)

L'intégralité de l'API backend est construite avec [tRPC](https://trpc.io/), qui fournit des API typées de bout en bout. Toute la logique de l'API se trouve dans `src/server/routers/`.

## Structure

Le routeur principal est `_app.ts`, qui fusionne tous les autres routeurs en une seule API unifiée. Chaque routeur est organisé par espace de nom (namespace) :

- `auth` : Gère les requêtes liées à l'authentification.
- `campaign` : Gère la création et l'administration des campagnes.
- `poll` : Gère les interactions publiques avec les sondages (récupération d'infos, soumission de votes).
- `results` : Fournit les données pour le tableau de bord des résultats.

Les procédures sont définies comme `protectedProcedure` (nécessitant une session utilisateur authentifiée) ou `procedure` (accessible publiquement).

---

## `authRouter`

Gère la configuration initiale et les vérifications d'authentification.

### `auth.canRegister`

- **Type** : `Query`
- **Accès** : Public (`procedure`)
- **Description** : Vérifie si un utilisateur existe dans la base de données. Ceci est utilisé par le frontend pour déterminer s'il faut afficher un formulaire d'inscription (pour le premier admin) ou de connexion.
- **Input** : `void`
- **Output** :
  ```ts
  {
    canRegister: boolean;
  }
  ```

---

## `campaignRouter`

Toutes les procédures de ce routeur sont protégées et nécessitent une session utilisateur active.

### `campaign.list`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère la liste de toutes les campagnes créées par l'utilisateur connecté. Elle archive d'abord automatiquement toutes les campagnes dont la date `expiresAt` est passée, puis renvoie une liste formatée avec des statistiques agrégées.
- **Input** : `void`
- **Output** :
  ```ts
  Array<{
    id: number;
    name: string;
    managerCount: number;
    creationDate: string; // Formaté en "JJ/MM/AAAA"
    participationRate: number; // Entier de 0 à 100
    totalVotes: number;
    archived: boolean;
  }>;
  ```

### `campaign.getLinks`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère tous les liens de sondage pour une campagne spécifique.
- **Input** : `number` (Le `campaignId`)
- **Output** :
  ```ts
  Array<{
    id: string;
    managerName: string;
    url: string;
  }>;
  ```

### `campaign.addManager`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Ajoute un nouveau manager et son lien de sondage associé à une campagne existante. Empêche les noms de manager en double au sein de la même campagne.
- **Input** :
  ```ts
  {
    campaignId: number;
    managerName: string;
  }
  ```
- **Output** :
  ```ts
  {
    id: string;
    managerName: string;
    url: string;
  }
  ```

### `campaign.setArchiveStatus`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Archive ou désarchive manuellement une campagne.
- **Input** :
  ```ts
  {
    campaignId: number;
    archived: boolean;
  }
  ```
- **Output** :
  ```ts
  {
    success: boolean;
    archived: boolean;
  }
  ```

### `campaign.create`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Crée une nouvelle campagne et génère simultanément tous ses liens de sondage initiaux à partir d'une liste de noms de managers.
- **Input** :
  ```ts
  {
    name: string;
    managers: string[];
    expiresAt?: Date;
  }
  ```
- **Output** :
  ```ts
  {
    campaignId: number;
    campaignName: string;
    generatedLinks: Array<{
      managerName: string;
      url: string;
    }>;
  }
  ```

---

## `pollRouter`

Ces procédures sont publiques et gèrent les interactions directes avec un sondage.

### `poll.getInfoByToken`

- **Type** : `Query`
- **Accès** : Public
- **Description** : Récupère les informations publiques sur un sondage via son token unique. Utilisé sur la page de vote pour afficher le contexte.
- **Input** : `string` (Le `pollToken`)
- **Output** :
  ```ts
  {
    managerName: string;
    campaignName: string;
  }
  ```

### `poll.submitVote`

- **Type** : `Mutation`
- **Accès** : Public
- **Description** : Soumet un vote pour un sondage, identifié par son token.
- **Input** :
  ```ts
  {
    pollToken: string;
    mood: "green" | "blue" | "yellow" | "red";
    comment?: string;
  }
  ```
- **Output** :
  ```ts
  {
    message: string;
    voteId: number;
  }
  ```

---

## `resultsRouter`

Toutes les procédures de ce routeur sont protégées et sont utilisées pour peupler le tableau de bord des résultats.

### `results.getCampaignOptions`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère une liste simplifiée des campagnes (id et nom) de l'utilisateur, destinée à être utilisée dans des composants d'UI de type select/dropdown.
- **Input** : `void`
- **Output** :
  ```ts
  Array<{
    id: number;
    name: string;
  }>;
  ```

### `results.getManagerOptions`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère une liste distincte de noms de managers, soit pour une campagne spécifique, soit pour toutes les campagnes de l'utilisateur.
- **Input** :
  ```ts
  {
    campaignId: number | "all";
  }
  ```
- **Output** : `Array<string>`

### `results.getFilteredResults`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Le principal point d'accès pour récupérer les données du tableau de bord. Il agrège et traite les votes en fonction d'un ensemble de filtres et renvoie une charge utile complète pour la visualisation.
- **Input** :
  ```ts
  {
    campaignId: number | "all";
    managerName: string | "all";
    dateRange: {
      from?: Date;
      to?: Date;
    };
  }
  ```
- **Output** : Un objet complexe contenant toutes les données nécessaires pour le tableau de bord, y compris `totalVotes`, `moodDistribution`, `comments`, etc.
