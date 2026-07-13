// const { $pinia } = useNuxtApp()

// const navTabStore = useNavTabStore($pinia)

export default defineNuxtRouteMiddleware((to, from) => {
    // console.log("navTab.global", to, from)

    // const { $pinia } = useNuxtApp()

    const navTabStore = useNavTabStore()

    // console.log(navTabStore)

    if (to.meta.layout !== "nav") return

    const repeatedTab = navTabStore.cachedTabs.find(tab => tab.path === to.path)

    if (!repeatedTab) navTabStore.tabsAdd(to)
})
