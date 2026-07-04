<script lang="ts" setup>
type copyStatus = "normal" | "clicked" | "error"

const props = defineProps({
    copyContent: { type: [String, Number], default: "" },
    clickedDuring: { type: Number, default: 2000 }
})

const copyStatus = ref<copyStatus>("normal")

const copy = async (copyContent: string | number = props.copyContent) => {
    if (copyStatus.value !== "normal") return
    if (props.copyContent === "") return

    try {
        await navigator.clipboard.writeText(String(copyContent))
        copyStatus.value = "clicked"
    } catch (error) {
        console.error(error)
        copyStatus.value = "error"
        ElMessage({ type: "error", message: "复制失败了, 可能是因为 clipboard 不支持 https 和 localhost 以外的方式调用" })
    }

    setTimeout(() => (copyStatus.value = "normal"), props.clickedDuring)
}
</script>

<template>
    <Icon v-if="copyStatus === 'normal'" class="clip-icon cursor-pointer" name="tabler:copy-filled" @click="() => copy()" />
    <Icon v-if="copyStatus === 'clicked'" class="clip-icon" name="el:ok" @click="() => copy()" />
    <Icon v-if="copyStatus === 'error'" class="clip-icon" name="icon-park-solid:error" @click="() => copy()" />
</template>

<style scoped>
.clip-icon {
    /* color: var(--el-color-primary); */
}
</style>
