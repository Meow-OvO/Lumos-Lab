import type { RouterConfig } from "@nuxt/schema"

export default <RouterConfig>{
    routes: _routes => [
        {
            // name: "index",
            path: "/",
            // meta: { layout: "nav" },
            component: () => import("@/pages/index.vue")
        },
        {
            // name: "index-page",
            path: "/home",
            meta: { layout: "nav" },
            component: () => import("@/pages/home/index.vue")
        },
        {
            // name: "about",
            path: "/about",
            meta: { layout: "nav" },
            component: () => import("@/pages/about.vue")
        },
        { name: "millionDataEcharts", path: "/millionDataEcharts", meta: { layout: "nav" }, component: () => import("@/pages/millionDataEcharts/index.vue") }
        // { name: "environmentInfo", path: "/environmentInfo", meta: { layout: "nav" }, component: () => import("@/pages/environmentInfo/index.vue") }
    ]
}
