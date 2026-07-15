import type { RouteLocationNormalized } from "vue-router"

// import { navRoutes } from "@/router.options"

export const useNavTabStore = defineStore(
    "navTabStore",
    () => {
        const router = useRouter()
        const route = useRoute()

        const cachedTabs = ref<RouteLocationNormalized[]>([])

        // 判断当前页左侧是否有标签
        const hasTabsLeft = computed(() => {
            const index = cachedTabs.value.findIndex(t => t.path === route.path)
            return index > 0 // 索引大于0说明左侧有标签
        })

        // 判断当前页右侧是否有标签
        const hasTabsRight = computed(() => {
            const index = cachedTabs.value.findIndex(t => t.path === route.path)
            return index !== -1 && index < cachedTabs.value.length - 1
        })

        const tabsAdd = (tab: RouteLocationNormalized) => cachedTabs.value.push(tab)

        // const tabsRemove = (tab: RouteLocationNormalized) => {
        //     const index = cachedTabs.value.findIndex(t => t.path === tab.path)
        //     if (index !== -1) cachedTabs.value.splice(index, 1)
        // }

        const tabsRemove = (tab: RouteLocationNormalized) => {
            const index = cachedTabs.value.findIndex(t => t.path === tab.path)
            if (index === -1) return

            const isCurrent = route.path === tab.path

            let targetPath: string | null = null
            if (isCurrent) {
                const nextTab = cachedTabs.value[index + 1]
                const prevTab = cachedTabs.value[index - 1]
                targetPath = nextTab?.path || prevTab?.path || "/home"
            }

            cachedTabs.value.splice(index, 1)

            if (isCurrent && targetPath) router.push(targetPath)
        }

        const tabsRemoveOthers = () => (cachedTabs.value = cachedTabs.value.filter(t => t.path === route.path))

        const tabsRemoveLeft = () => {
            const index = cachedTabs.value.findIndex(t => t.path === route.path)
            if (index !== -1) cachedTabs.value = cachedTabs.value.slice(index)
        }

        const tabsRemoveRight = () => {
            const index = cachedTabs.value.findIndex(t => t.path === route.path)
            if (index !== -1) cachedTabs.value = cachedTabs.value.slice(0, index + 1)
        }

        const tabsRemoveAll = () => {
            const homeTab = router.resolve("/home") as RouteLocationNormalized
            cachedTabs.value = [homeTab]
            router.push(homeTab)
        }

        return { cachedTabs, hasTabsLeft, hasTabsRight, tabsAdd, tabsRemove, tabsRemoveAll, tabsRemoveOthers, tabsRemoveLeft, tabsRemoveRight }
    },
    { persist: true }
)
