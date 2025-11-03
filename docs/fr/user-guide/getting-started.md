# Pour Commencer

Ce guide vous expliquera comment configurer votre compte administrateur pour la première fois.

## Création du Premier Compte

L'application Mood est conçue pour être gérée par un unique administrateur. Par conséquent, l'inscription n'est ouverte que jusqu'à la création du premier compte.

1.  **Accéder à l'Application** : Ouvrez l'URL où votre application Mood est hébergée (par exemple, `http://localhost:3000`).
2.  **Accéder au Formulaire d'Inscription** : Si aucun compte administrateur n'existe, vous verrez un onglet "Sign Up". Cliquez dessus.
3.  **Remplir les Informations** :
    - **Email** : Votre adresse e-mail, qui sera utilisée pour vous connecter.
    - **Username** : Votre nom d'affichage.
    - **Password** : Choisissez un mot de passe fort (minimum 8 caractères).
    - **Clé d'invitation** : Saisissez la clé secrète `INVITATION_KEY` qui a été configurée dans le fichier `.env` de votre serveur. C'est une mesure de sécurité pour garantir que seule une personne autorisée peut créer le premier compte.
4.  **Créer le Compte** : Cliquez sur le bouton "Créer un compte".

Une fois votre compte créé, le formulaire d'inscription sera définitivement désactivé. Toutes les visites futures n'afficheront que le formulaire "Sign In". Vous pouvez maintenant vous connecter pour accéder au tableau de bord d'administration.
