// https://nuxt.com/docs/api/configuration/nuxt-config

import dayjs from "dayjs"

export default defineNuxtConfig({
    compatibilityDate: "2026-06-11",
    ssr: false,
    devtools: { enabled: true },
    modules: ["@element-plus/nuxt", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt", "@nuxtjs/tailwindcss", "@hypernym/nuxt-anime", "@nuxt/icon"],
    devServer: { port: 4060 },
    elementPlus: { icon: "", defaultLocale: "zh-cn", globalConfig: { size: "default" } },
    app: { head: { title: "Lumos Lab" }, baseURL: "/Lumos-Lab/" },
    css: ["@/assets/style/index.css"],
    runtimeConfig: { public: { buildTime: dayjs().format("YYYY-MM-DD HH:mm:ss") } }
})
