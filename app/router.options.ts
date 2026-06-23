import type { RouterConfig } from "@nuxt/schema"

export default <RouterConfig>{
    routes: _routes => [
        { path: "/", component: () => import("@/pages/index.vue") },
        { path: "/home", meta: { layout: "nav" }, component: () => import("@/pages/home/index.vue") },
        { path: "/about", meta: { layout: "nav" }, component: () => import("@/pages/about.vue") },
        { path: "/devNotes", meta: { layout: "nav" }, component: () => import("@/pages/devNotes/index.vue") },
        { path: "/report", meta: { layout: "nav" }, component: () => import("@/pages/report/index.vue") },
        { name: "millionDataEcharts", path: "/millionDataEcharts", meta: { layout: "nav" }, component: () => import("@/pages/millionDataEcharts/index.vue") }
        // { name: "environmentInfo", path: "/environmentInfo", meta: { layout: "nav" }, component: () => import("@/pages/environmentInfo/index.vue") }
    ]
}
