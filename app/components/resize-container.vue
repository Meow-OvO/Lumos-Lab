<template>
    <div ref="resizeContainer" class="resize-container">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ (e: "resize", entry: ResizeObserverEntry): void }>()

const resizeContainer = ref<HTMLElement | null>(null)

const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        // const { width, height } = entry.contentRect
        emit("resize", entry)
    }
})

onMounted(() => {
    if (resizeContainer.value) resizeObserver.observe(resizeContainer.value)
})
</script>

<style></style>
