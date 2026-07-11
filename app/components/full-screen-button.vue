<template>
    <Icon
        v-show="isFullscreen"
        :name="fullScreenIcon"
        :size="props.size"
        class="cursor-pointer"
        :class="{ 'is-loading': isToggling }"
        @click="toggleFullscreen"
    />

    <Icon
        v-show="!isFullscreen"
        :name="fullScreenExitIcon"
        :size="props.size"
        class="cursor-pointer"
        :class="{ 'is-loading': isToggling }"
        @click="toggleFullscreen"
    />
</template>

<script setup lang="ts">
const props = defineProps({
    size: { default: 20 },
    fullScreenIcon: { default: "material-symbols:fullscreen-exit" },
    fullScreenExitIcon: { default: "material-symbols:fullscreen" }
})

const { isFullscreen, isToggling, toggleFullscreen } = useFullscreen({ showError: true })
</script>

<style scoped>
.is-loading {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
</style>
