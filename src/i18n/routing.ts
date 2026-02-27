import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/compress-video": {
      en: "/compress-video",
      es: "/comprimir-video",
    },
    "/convert-video": {
      en: "/convert-video",
      es: "/convertir-video",
    },
    "/resize-video": {
      en: "/resize-video",
      es: "/redimensionar-video",
    },
    "/mute-video": {
      en: "/mute-video",
      es: "/silenciar-video",
    },
    "/rotate-video": {
      en: "/rotate-video",
      es: "/rotar-video",
    },
  },
});
