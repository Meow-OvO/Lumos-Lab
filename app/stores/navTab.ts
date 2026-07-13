import type { RouteLocationNormalized } from "vue-router"

export const useNavTabStore = defineStore(
    "navTabStore",
    () => {
        const cachedTabs = ref<RouteLocationNormalized[]>([])

        const tabsAdd = (tab: RouteLocationNormalized) => cachedTabs.value.push(tab)

        const tabsRemove = (tab: RouteLocationNormalized) => {
            const index = cachedTabs.value.findIndex(t => t.path === tab.path)
            if (index !== -1) cachedTabs.value.splice(index, 1)
        }

        const tabsRemoveAll = (tab: RouteLocationNormalized) => (cachedTabs.value = [])

        return { cachedTabs, tabsAdd, tabsRemove, tabsRemoveAll }
    },
    { persist: true }
)
