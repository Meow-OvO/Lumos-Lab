// https://nuxt.com/docs/api/configuration/nuxt-config

import dayjs from "dayjs"

export default defineNuxtConfig({
    compatibilityDate: "2026-06-11",
    ssr: false,
    devtools: { enabled: true },
    modules: [
        "@element-plus/nuxt",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@nuxtjs/tailwindcss",
        "@hypernym/nuxt-anime",
        "@nuxt/icon",
        "@formkit/auto-animate",
        [
            "unplugin-auto-import/nuxt",
            {
                dts: "./types/lodash-global.d.ts",
                imports: [
                    {
                        "lodash-es": [
                            ["cloneDeep", "lo_cloneDeep"],
                            ["debounce", "lo_debounce"],
                            ["throttle", "lo_throttle"],
                            ["get", "lo_get"],
                            ["set", "lo_set"],
                            ["omit", "lo_omit"],
                            ["omitBy", "lo_omitBy"],
                            ["isUndefined", "lo_isUndefined"],
                            ["groupBy", "lo_groupBy"],
                            ["random", "lo_random"]
                        ]
                    }
                ]
            }
        ]
    ],
    devServer: { port: 4060 },
    elementPlus: { icon: "", defaultLocale: "zh-cn", globalConfig: { size: "default" } },
    app: { head: { title: "Lumos Lab" }, baseURL: "/Lumos-Lab/" },
    css: ["@/assets/style/index.css", "ol/ol.css"],
    runtimeConfig: { public: { buildTime: dayjs().format("YYYY-MM-DD HH:mm:ss") } },
    tailwindcss: { config: { content: ["./app/views/**/*.{vue,js,ts}"] } },

    vite: {
        optimizeDeps: {
            include: [
                "@amap/amap-jsapi-loader", // CJS
                "@faker-js/faker",
                "@vue/devtools-core",
                "@vue/devtools-kit",
                "dayjs", // CJS
                "dayjs/plugin/*.js",
                "echarts"
            ]
        }
    }
})
