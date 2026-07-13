<script setup lang="ts">
import type { RouteLocationNormalized } from "vue-router"

import singleTab from "./singleTab.vue"

const navTabStore = useNavTabStore()
const router = useRouter()
const route = useRoute()

const tabClick = (tab: RouteLocationNormalized) => router.push(tab.path)

const tabClose = (tab: RouteLocationNormalized) => {
    if (route.path !== tab.path) return navTabStore.tabsRemove(tab)

    const cachedTabs = navTabStore.cachedTabs
    const currentIndex = cachedTabs.findIndex(t => t.path === tab.path)

    if (currentIndex !== -1) {
        // 优先找后一个tab
        const nextTab = cachedTabs[currentIndex + 1]
        if (nextTab) {
            navTabStore.tabsRemove(tab)
            router.push(nextTab.path)
            return
        }

        // 如果没有后一个，找前一个
        const prevTab = cachedTabs[currentIndex - 1]
        if (prevTab) {
            navTabStore.tabsRemove(tab)
            router.push(prevTab.path)
            return
        }

        // 前后都没有，跳转home
        navTabStore.tabsRemove(tab)
        router.push("/home")
    }
}
</script>

<template>
    <div ref="containerRef" v-auto-animate class="nav-tabs-container">
        <singleTab v-for="tab in navTabStore.cachedTabs" :key="tab.path" :tab="tab" @tab-click="tabClick" @tab-close="tabClose" />
    </div>
</template>

<style scoped>
.nav-tabs-container {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    background: #fff;
    border-top: 1px solid #cbd5e1;
    border-bottom: 1px solid #cbd5e1;
    overflow-x: auto;
    overflow-y: hidden;
}

/* 隐藏滚动条（可选） */
.nav-tabs-container::-webkit-scrollbar {
    height: 2px;
}
.nav-tabs-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}
</style>
