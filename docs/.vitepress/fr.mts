import { defineConfig } from "vitepress";

export const fr = defineConfig({
  lang: "fr-FR",
  description: "Documentation développeur et utilisateur pour le projet Mood.",

  themeConfig: {
    nav: [
      { text: "Accueil", link: "/fr/" },
      { text: "Guide Utilisateur", link: "/fr/user-guide/introduction" },
      {
        text: "Guide Développeur",
        link: "/fr/developer-guide/introduction",
      },
    ],

    sidebar: {
      "/fr/user-guide/": [
        {
          text: "Guide Utilisateur",
          items: [
            {
              text: "Introduction",
              link: "/fr/user-guide/introduction",
            },
          ],
        },
      ],
      "/fr/developer-guide/": [
        {
          text: "Pour Commencer",
          items: [
            {
              text: "Introduction",
              link: "/fr/developer-guide/introduction",
            },
            {
              text: "Installation du Projet",
              link: "/fr/developer-guide/setup",
            },
          ],
        },
        {
          text: "Architecture Backend",
          items: [
            {
              text: "Schéma de Données",
              link: "/fr/developer-guide/database",
            },
            {
              text: "Routes API (tRPC)",
              link: "/fr/developer-guide/api-trpc",
            },
            {
              text: "Authentification",
              link: "/fr/developer-guide/authentication",
            },
            { text: "Déploiement", link: "/fr/developer-guide/deployment" },
            { text: "Middleware", link: "/fr/developer-guide/middleware" },
            {
              text: "Logique Partagée",
              link: "/fr/developer-guide/shared-logic",
            },
          ],
        },
        {
          text: "Frontend",
          items: [
            {
              text: "Architecture",
              link: "/fr/developer-guide/frontend-architecture",
            },
            {
              text: "Patterns Essentiels",
              link: "/fr/developer-guide/frontend-patterns",
            },
          ],
        },
      ],
    },

    lastUpdated: {
      text: "Dernière mise à jour",
    },

    docFooter: {
      prev: "Page précédente",
      next: "Page suivante",
    },

    footer: {
      message: "Publié sous la licence MIT.",
      copyright: "Copyright © 2025-present Priveetee",
    },

    editLink: {
      pattern: "https://github.com/Priveetee/Docs_Mood/edit/main/docs/:path",
      text: "Modifier cette page sur GitHub",
    },
  },
});
