<script setup>
import navTabs from "./nav/navTabs.vue"
import { navRoutes } from "@/router.options"

const navTabStore = useNavTabStore()
const route = useRoute()

const menuCollapse = ref(false)

const currentPageActive = ref(true)
const reloadCurrentPage = () => {
    currentPageActive.value = false
    nextTick(() => (currentPageActive.value = true))
}
</script>

<template>
    <el-container class="layout-container-demo">
        <el-aside width="auto" class="h-[100vh] bg-[#1e293b] pt-[0px]">
            <el-scrollbar>
                <el-menu
                    background-color="#001428"
                    text-color="#bbb"
                    active-text-color="#fff"
                    class="nav-menu"
                    :collapse="menuCollapse"
                    router
                    :default-active="$route.path"
                >
                    <el-menu-item v-for="nav in navRoutes" :index="nav.path">
                        <el-icon><Icon :name="nav.meta.icon" /></el-icon>
                        <span>{{ nav.meta.title }}</span>
                    </el-menu-item>
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header class="bg-white">
                <el-row class="h-full" align="middle" justify="space-between">
                    <el-row>
                        <el-icon size="24px" v-if="!menuCollapse" @click="menuCollapse = true"><Fold /></el-icon>
                        <el-icon size="24px" v-if="menuCollapse" @click="menuCollapse = false"><Expand /></el-icon>
                    </el-row>

                    <full-screen-button></full-screen-button>
                </el-row>
            </el-header>

            <el-row class="nav-tab-container">
                <navTabs ref="navTabsRef" class="flex-1" />

                <el-row justify="center" align="middle" class="px-3">
                    <Icon class="mr-2 cursor-pointer" name="mage:reload" @click="reloadCurrentPage" />

                    <el-dropdown trigger="click">
                        <Icon class="cursor-pointer" name="mage:chevron-down" />

                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="reloadCurrentPage">
                                    <Icon name="mdi:refresh" class="mr-1" />
                                    <span>刷新当前</span>
                                </el-dropdown-item>
                                <el-dropdown-item
                                    :disabled="navTabStore.cachedTabs.length <= 1 && route.path === '/home'"
                                    @click="navTabStore.tabsRemove(route)"
                                >
                                    <Icon name="mdi:close" class="mr-1" />
                                    <span>关闭当前</span>
                                </el-dropdown-item>
                                <el-dropdown-item :disabled="navTabStore.cachedTabs.length <= 1" divided @click="navTabStore.tabsRemoveOthers">
                                    <Icon name="mdi:close-circle-outline" class="mr-1" />
                                    <span>关闭其他</span>
                                </el-dropdown-item>
                                <el-dropdown-item :disabled="!navTabStore.hasTabsLeft" @click="navTabStore.tabsRemoveLeft()">
                                    <Icon name="mdi:arrow-left" class="mr-1" />
                                    <span>关闭左侧</span>
                                </el-dropdown-item>
                                <el-dropdown-item :disabled="!navTabStore.hasTabsRight" @click="navTabStore.tabsRemoveRight()">
                                    <Icon name="mdi:arrow-right" class="mr-1" />
                                    <span>关闭右侧</span>
                                </el-dropdown-item>
                                <el-dropdown-item
                                    :disabled="navTabStore.cachedTabs.length <= 1 && route.path === '/home'"
                                    divided
                                    @click="navTabStore.tabsRemoveAll()"
                                >
                                    <Icon name="mdi:close-circle" class="mr-1" />
                                    <span>关闭所有</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-row>
            </el-row>

            <main>
                <el-scrollbar class="main-content-scroll-container">
                    <slot v-if="currentPageActive" />
                </el-scrollbar>
            </main>
        </el-container>
    </el-container>
</template>

<style scoped>
.main-content-scroll-container {
    height: calc(100vh - 100px);
}

/* ==================== 菜单容器 ==================== */
.el-menu.el-menu {
    background-color: #1e293b;
    border-right: none;
}

/* ==================== 菜单项 ==================== */
.el-menu .el-menu-item {
    color: #cbd5e1;
}

.el-menu .el-menu-item:hover {
    background-color: #334155;
    color: #ffffff;
}

.el-menu .el-menu-item.is-active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #ffffff;
}

.el-menu .el-menu-item.is-active .el-icon {
    color: #ffffff;
}

/* ==================== 子菜单 ==================== */
.el-menu .el-sub-menu .el-sub-menu__title {
    color: #cbd5e1;
}

.el-menu .el-sub-menu .el-sub-menu__title:hover {
    background-color: #334155;
    color: #ffffff;
}

.el-menu .el-sub-menu.is-opened > .el-sub-menu__title {
    color: #ffffff;
}

/* ==================== 菜单组标题 ==================== */
.el-menu .el-menu-item-group__title {
    color: #64748b;
}

/* ==================== 折叠模式下的弹出菜单 ==================== */
.el-menu--popup.el-menu--popup {
    background-color: #1e293b;
}

.el-menu--popup .el-menu-item {
    color: #cbd5e1;
}

.el-menu--popup .el-menu-item:hover {
    background-color: #334155;
    color: #ffffff;
}

.el-menu--popup .el-menu-item.is-active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #ffffff;
}

.nav-tab-container {
    border-top: 1px solid #cbd5e1;
    border-bottom: 1px solid #cbd5e1;
    background: #fff;
}

/* .layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
    border-right: none;
}
.layout-container-demo .el-main {
    padding: 0;
}
.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
} */
</style>
