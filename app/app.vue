<template>
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome /> -->
    <NuxtLayout :name="layoutName">
        <NuxtPage keepalive />

        <NuxtLoadingIndicator />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute()
// 根据当前页面的 meta 配置，获取布局名，默认返回 'default'
const layoutName = computed(() => route.meta.layout || "default")
</script>

<style scoped></style>
