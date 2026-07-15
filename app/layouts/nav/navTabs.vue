<script setup lang="ts">
import type { RouteLocationNormalized } from "vue-router"

import singleTab from "./singleTab.vue"

const navTabStore = useNavTabStore()
const router = useRouter()

const containerRef = ref<HTMLElement | null>(null)

useHorizontalScroll(containerRef, { speed: 1.5 })

const tabClick = (tab: RouteLocationNormalized) => router.push(tab.path)

onMounted(() => {})
</script>

<template>
    <div ref="containerRef" v-auto-animate class="nav-tabs-container">
        <singleTab
            v-for="tab in navTabStore.cachedTabs"
            :key="tab.path"
            :tab="tab"
            @tab-click="tabClick"
            @tab-close="navTabStore.tabsRemove"
            :closeable="!(tab.path === '/home' && navTabStore.cachedTabs.length === 1)"
        />
    </div>
</template>

<style scoped>
.nav-tabs-container {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 12px;
    border-right: 1px solid #cbd5e1;

    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
}

/* 隐藏滚动条（可选） */
.nav-tabs-container::-webkit-scrollbar {
    height: 1px;
    margin-bottom: -1px;
}
.nav-tabs-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    /* border-radius: 2px; */
}
</style>
