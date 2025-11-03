import { defineConfig } from "vitepress";

export const en = defineConfig({
  lang: "en-US",
  description: "Developer and user documentation for the Mood project.",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Developer Guide", link: "/developer-guide/introduction" },
    ],

    sidebar: {
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
