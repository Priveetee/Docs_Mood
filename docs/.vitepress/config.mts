import { defineConfig } from "vitepress";
import { en } from "./en.mts";
import { fr } from "./fr.mts";

export default defineConfig({
  title: "Mood Docs",
  base: "/Docs_Mood/",

  head: [["link", { rel: "icon", href: "/Docs_Mood/mood-logo.svg" }]],

  themeConfig: {
    logo: "/mood-logo.svg",
    search: {
      provider: "local",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Priveetee/Docs_Mood",
      },
    ],
  },

  locales: {
    root: {
      label: "English",
      ...en,
    },
    fr: {
      label: "Français",
      link: "/fr/",
      ...fr,
    },
  },
});
