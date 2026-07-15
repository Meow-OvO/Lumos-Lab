import type { RouterConfig } from "@nuxt/schema"
import type { RouterOptions } from "vue-router"

const baseRoutes = [
    { path: "/", component: () => import("@/views/index.vue") },
    { path: "/about", meta: { layout: "nav" }, component: () => import("@/views/about.vue") },
    { path: "/openLayers", meta: { layout: "nav" }, component: () => import("@/views/openLayers/index.vue") },
    { path: "/echarts", meta: { layout: "nav", title: "echarts" }, component: () => import("@/views/echarts/index.vue") }
    // { name: "environmentInfo", path: "/environmentInfo", meta: { layout: "nav" }, component: () => import("@/views/environmentInfo/index.vue") }
]

export const navRoutes = [
    {
        path: "/home",
        meta: { layout: "nav", title: "主页", icon: "ep:home-filled" },
        component: () => import("@/views/home/index.vue")
    },
    {
        path: "/devNotes",
        meta: { layout: "nav", title: "开发手记", icon: "material-symbols:sticky-note-2-outline-rounded" },
        component: () => import("@/views/devNotes/index.vue")
    },
    {
        path: "/report",
        meta: { layout: "nav", title: "数据报表", icon: "material-symbols-light:table-outline-sharp" },
        component: () => import("@/views/report/index.vue")
    },
    {
        path: "/millionDataEcharts",
        meta: { layout: "nav", title: "百万级数据图形渲染", icon: "mdi:chart-line" },
        component: () => import("@/views/millionDataEcharts/index.vue")
    },
    {
        path: "/amap",
        meta: { layout: "nav", title: "高德地图", icon: "famicons:paper-plane-outline" },
        component: () => import("@/views/amap/index.vue")
    }
]

const routesConfig = [...baseRoutes, ...navRoutes]

export default <RouterConfig>{ routes: _routes => routesConfig }
