<script setup lang="ts">
const route = useRoute()

const emits = defineEmits(["tabClick", "tabClose"])

const props = defineProps({
    tab: Object,
    closeable: { type: Boolean, default: true }
})
</script>

<template>
    <div class="tab-item" :class="{ active: props.tab?.path === route.path, 'tab-item-hover': props.closeable }" @click="emits('tabClick', tab)">
        <Icon v-if="props.tab?.meta.icon" :name="props.tab?.meta.icon" class="page-icon" size="14"></Icon>

        <span class="leading-none">{{ props.tab?.meta.title }}</span>

        <Icon name="material-symbols:close-rounded" class="close-icon" @click.stop="props.closeable && emits('tabClose', tab)"></Icon>
    </div>
</template>

<style scoped>
.tab-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    height: 28px;
    padding: 0 10px 0 14px;
    border-radius: 4px;
    background-color: var(--el-color-info-light-7);
    white-space: nowrap;
    cursor: pointer;
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
    font-size: 12px;
}

.tab-item.active {
    color: #fff;
    background-color: var(--el-color-primary);
}

.page-icon {
    opacity: 1;
}

.close-icon {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tab-item-hover:hover .close-icon {
    opacity: 1;
}
</style>
