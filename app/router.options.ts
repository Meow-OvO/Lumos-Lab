import type { RouterConfig } from "@nuxt/schema"

const routesConfig = [
    { path: "/", component: () => import("@/views/index.vue") },
    { path: "/home", meta: { layout: "nav" }, component: () => import("@/views/home/index.vue") },
    { path: "/about", meta: { layout: "nav" }, component: () => import("@/views/about.vue") },
    { path: "/devNotes", meta: { layout: "nav" }, component: () => import("@/views/devNotes/index.vue") },
    { path: "/report", meta: { layout: "nav" }, component: () => import("@/views/report/index.vue") },
    { path: "/millionDataEcharts", meta: { layout: "nav" }, component: () => import("@/views/millionDataEcharts/index.vue") },
    { path: "/amap", meta: { layout: "nav" }, component: () => import("@/views/amap/index.vue") }
    // { name: "environmentInfo", path: "/environmentInfo", meta: { layout: "nav" }, component: () => import("@/views/environmentInfo/index.vue") }
]

export default <RouterConfig>{
    routes: _routes => {
        console.log(_routes)
        return routesConfig
    }
}
