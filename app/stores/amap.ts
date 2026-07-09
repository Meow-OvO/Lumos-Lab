import { defineStore } from "pinia"

export const useAmapStore = defineStore("amapStore", {
    state: () => ({
        AMAP_JS_KEY: "eb469a90dd8476c0cf8210006d25afc3",
        AMAP_WEB_KEY: "930ed13b65a9685b396b5b117d98b67a",
        AMAP_SECURITY_JS_CODE: "75786255f35fa7e3680556c0b5d12516"
    }),
    actions: {}
})
