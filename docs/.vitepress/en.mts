import { defineConfig } from "vitepress";

export const en = defineConfig({
  lang: "en-US",
  description: "Developer and user documentation for the Mood project.",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "User Guide", link: "/user-guide/introduction" },
      { text: "Developer Guide", link: "/developer-guide/introduction" },
    ],

    sidebar: {
      "/user-guide/": [
        {
          text: "User Guide",
          items: [
            { text: "Introduction", link: "/user-guide/introduction" },
            { text: "Getting Started", link: "/user-guide/getting-started" },
            {
              text: "Creating Campaigns",
              link: "/user-guide/creating-campaigns",
            },
            {
              text: "Managing Campaigns",
              link: "/user-guide/managing-campaigns",
            },
            {
              text: "Analyzing Results",
              link: "/user-guide/analyzing-results",
            },
          ],
        },
      ],
      "/developer-guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/developer-guide/introduction" },
            { text: "Project Setup", link: "/developer-guide/setup" },
          ],
        },
        {
          text: "Backend Architecture",
          items: [
            { text: "Database Schema", link: "/developer-guide/database" },
            { text: "API Routes (tRPC)", link: "/developer-guide/api-trpc" },
            {
              text: "Authentication",
              link: "/developer-guide/authentication",
            },
            { text: "Deployment", link: "/developer-guide/deployment" },
            { text: "Middleware", link: "/developer-guide/middleware" },
            { text: "Shared Logic", link: "/developer-guide/shared-logic" },
          ],
        },
        {
          text: "Frontend",
          items: [
            {
              text: "Architecture",
              link: "/developer-guide/frontend-architecture",
            },
            {
              text: "Core Patterns",
              link: "/developer-guide/frontend-patterns",
            },
            {
              text: "Advanced Visuals",
              link: "/developer-guide/advanced-visuals",
            },
          ],
        },
      ],
    },

    lastUpdated: {
      text: "Last Updated",
    },

    docFooter: {
      prev: "Previous page",
      next: "Next page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Priveetee",
    },

    editLink: {
      pattern: "https://github.com/Priveetee/Docs_Mood/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
