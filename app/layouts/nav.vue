<script lang="ts" setup>
const menuCollapse = ref(false)

const navTabStore = useNavTabStore()
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
                    <el-menu-item index="/home">
                        <el-icon><HomeFilled /></el-icon>
                        <span>主页</span>
                    </el-menu-item>

                    <el-menu-item index="/devNotes">
                        <el-icon><Icon name="material-symbols:sticky-note-2-outline-rounded" /></el-icon>
                        <span>开发手记</span>
                    </el-menu-item>

                    <el-menu-item index="/report">
                        <el-icon><Icon name="material-symbols-light:table-outline-sharp" /></el-icon>
                        <span>数据报表</span>
                    </el-menu-item>

                    <el-menu-item index="/millionDataEcharts">
                        <el-icon><Icon name="mdi:chart-line" /></el-icon>
                        <span>百万级数据图形渲染</span>
                    </el-menu-item>

                    <el-menu-item index="/amap">
                        <el-icon><Icon name="mdi:map-marker" /></el-icon>
                        <span>高德地图</span>
                    </el-menu-item>

                    <!-- <el-menu-item index="/environmentInfo">
                        <el-icon><PieChart /></el-icon>
                        <span>系统环境信息</span>
                    </el-menu-item> -->

                    <!-- <el-sub-menu index="1">
                        <template #title>
                            <el-icon><message /></el-icon>
                            <span>Navigator One</span>
                        </template>

                        <el-menu-item-group>
                            <template #title>Group 1</template>
                            <el-menu-item index="/about">about</el-menu-item>
                            <el-menu-item index="1-2">Option 2</el-menu-item>
                        </el-menu-item-group>

                        <el-menu-item-group title="Group 2">
                            <el-menu-item index="1-3">Option 3</el-menu-item>
                        </el-menu-item-group>

                        <el-sub-menu index="1-4">
                            <template #title>Option4</template>
                            <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon><HomeFilled /></el-icon>
                            <span>Navigator Two</span>
                        </template>
                        <el-menu-item-group>
                            <template #title>Group 1</template>
                            <el-menu-item index="2-1">Option 1</el-menu-item>
                            <el-menu-item index="2-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                            <el-menu-item index="2-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="2-4">
                            <template #title>Option 4</template>
                            <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon><setting /></el-icon>
                            <span>Navigator Three</span>
                        </template>
                        <el-menu-item-group>
                            <template #title>Group 1</template>
                            <el-menu-item index="3-1">Option 1</el-menu-item>
                            <el-menu-item index="3-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                            <el-menu-item index="3-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="3-4">
                            <template #title>Option 4</template>
                            <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu> -->
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header class="bg-white">
                <el-row class="h-full" align="middle">
                    <el-icon size="24px" v-if="!menuCollapse" @click="menuCollapse = true"><Fold /></el-icon>
                    <el-icon size="24px" v-if="menuCollapse" @click="menuCollapse = false"><Expand /></el-icon>
                </el-row>
            </el-header>

            <main>
                <el-scrollbar class="main-content-scroll-container">
                    <slot />
                </el-scrollbar>
            </main>
        </el-container>
    </el-container>
</template>

<style scoped>
.main-content-scroll-container {
    height: calc(100vh - 60px);
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
