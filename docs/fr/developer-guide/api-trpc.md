# Routes API (tRPC)

L'intégralité de l'API backend est construite avec [tRPC](https://trpc.io/), qui fournit des API typées de bout en bout. Toute la logique de l'API se trouve dans `src/server/routers/`. Ce document détaille chaque procédure et son rôle dans l'application.

## Structure

L'API est organisée en routeurs logiques :

- `auth` : Gère la configuration initiale et les vérifications d'authentification.
- `campaign` : Gère le cycle de vie des campagnes et de leurs liens de sondage.
- `poll` : Gère les interactions publiques pour le vote.
- `results` : Fournit des données agrégées pour le tableau de bord des résultats.

Les procédures sont soit `protectedProcedure` (nécessitant un utilisateur authentifié), soit `procedure` (publique).

---

## `authRouter`

### `auth.canRegister`

- **Type** : `Query`
- **Accès** : Public
- **Description** : Vérifie si un utilisateur existe dans la base de données. C'est une fonctionnalité de sécurité et d'UX critique.
- **Utilisation Frontend** : Appelée par `LoginForm.tsx` via le client `publicTrpc`. Le résultat détermine si l'onglet "Sign Up" est affiché, n'autorisant ainsi l'inscription que pour le tout premier administrateur.
- **Input** : `void`
- **Output** : `{ canRegister: boolean; }`

---

## `campaignRouter`

### `campaign.list`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère toutes les campagnes de l'utilisateur connecté, avec des statistiques agrégées. A pour effet de bord d'archiver automatiquement les campagnes dont la date d'expiration est passée.
- **Utilisation Frontend** : C'est la source de données principale pour la page `ActiveCampaignsPage.tsx`. Les données récupérées peuplent le tableau des campagnes.
- **Input** : `void`
- **Output** : `Array<{ id: number; name: string; managerCount: number; ... }>`

### `campaign.getLinks`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère tous les liens de sondage pour une campagne spécifique.
- **Utilisation Frontend** : Appelée conditionnellement dans `ActiveCampaignsPage.tsx` lorsque l'utilisateur ouvre la boîte de dialogue "Gérer les liens". La requête n'est activée que si un `selectedCampaignId` est défini.
- **Input** : `number` (Le `campaignId`)
- **Output** : `Array<{ id: string; managerName: string; url: string; }>`

### `campaign.addManager`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Ajoute un nouveau manager et son lien de sondage unique à une campagne existante.
- **Utilisation Frontend** : Appelée depuis la boîte de dialogue "Ajouter un manager" dans `ActiveCampaignsPage.tsx`. En cas de succès, elle invalide les requêtes `campaign.list` et `campaign.getLinks` via `useUtils` pour garantir une mise à jour instantanée de l'interface.
- **Input** : `{ campaignId: number; managerName: string; }`
- **Output** : `{ id: string; managerName: string; url: string; }`

### `campaign.setArchiveStatus`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Bascule le statut `archived` d'une campagne.
- **Utilisation Frontend** : Appelée depuis l'action "Archiver"/"Restaurer" du `DropdownMenu` sur la page `ActiveCampaignsPage.tsx`. En cas de succès, elle invalide la requête `campaign.list` pour rafraîchir le tableau.
- **Input** : `{ campaignId: number; archived: boolean; }`
- **Output** : `{ success: boolean; archived: boolean; }`

### `campaign.create`

- **Type** : `Mutation`
- **Accès** : Protégé
- **Description** : Crée une nouvelle campagne et, en une seule fois, tous ses liens de sondage initiaux.
- **Utilisation Frontend** : C'est la mutation principale de la page `NewCampaignPage.tsx`. En cas de succès, elle retourne les liens générés, ce qui provoque le basculement de l'interface du formulaire vers la vue des résultats.
- **Input** : `{ name: string; managers: string[]; expiresAt?: Date; }`
- **Output** : `{ campaignId: number; campaignName: string; generatedLinks: Array<{...}> }`

---

## `pollRouter`

### `poll.getInfoByToken`

- **Type** : `Query`
- **Accès** : Public
- **Description** : Récupère le nom public d'une campagne et d'un manager pour un token de sondage donné.
- **Utilisation Frontend** : Appelée sur `PollClientPage.tsx` avec le client `publicTrpc`. Le résultat est utilisé pour afficher du contexte à l'utilisateur (ex: "Sondage pour l'équipe de Jean Dupont (Campagne: Feedback Q4)"). Si la requête échoue, l'utilisateur est redirigé vers `/poll/closed`.
- **Input** : `string` (Le `pollToken`)
- **Output** : `{ managerName: string; campaignName: string; }`

### `poll.submitVote`

- **Type** : `Mutation`
- **Accès** : Public
- **Description** : Enregistre un nouveau vote pour un sondage donné.
- **Utilisation Frontend** : L'action principale de `PollClientPage.tsx`. Elle est appelée lorsque l'utilisateur soumet le formulaire. En cas de succès, un retour est donné via une notification toast.
- **Input** : `{ pollToken: string; mood: "green" | "blue" | ...; comment?: string; }`
- **Output** : `{ message: string; voteId: number; }`

---

## `resultsRouter`

### `results.getCampaignOptions`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère une liste simplifiée des campagnes de l'utilisateur.
- **Utilisation Frontend** : Utilisée sur la page `GlobalResultsClient` pour peupler le menu déroulant de sélection de campagne dans le composant `FilterBar`.
- **Input** : `void`
- **Output** : `Array<{ id: number; name: string; }>`

### `results.getManagerOptions`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Récupère une liste distincte de noms de managers en fonction de la ou des campagnes sélectionnées.
- **Utilisation Frontend** : Utilisée sur la page `GlobalResultsClient` pour peupler le menu déroulant de sélection de manager dans `FilterBar`. La liste se met à jour dynamiquement lorsque le filtre de campagne est modifié.
- **Input** : `{ campaignId: number | "all"; }`
- **Output** : `Array<string>`

### `results.getFilteredResults`

- **Type** : `Query`
- **Accès** : Protégé
- **Description** : Le principal point d'accès pour l'agrégation des données du tableau de bord. Il récupère et traite les votes en fonction des filtres de campagne, de manager et de date.
- **Utilisation Frontend** : C'est la source de données primaire pour `GlobalResultsClient`. L'objet de sortie complet fournit toutes les données nécessaires pour le rendu des composants `MoodChart`, `CommentsList` et `StatsCards`.
- **Input** : `{ campaignId: number | "all"; managerName: string | "all"; dateRange: {...}; }`
- **Output** : Un objet large contenant `totalVotes`, `moodDistribution`, `comments`, etc.
