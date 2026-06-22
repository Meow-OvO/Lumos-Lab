<script lang="ts" setup>
const props = defineProps({
    barColor: { type: String, default: "#409eff" },
    barWidth: { type: String, default: "4px" }
})
</script>

<template>
    <el-row align="middle" class="mb-[14px]">
        <div class="title-bar"></div>

        <span class="text-[16px] flex-1 font-bold overflow-hidden text-ellipsis text-nowrap">
            <slot name="default"></slot>
        </span>
    </el-row>
</template>

<style>
.title-bar {
    width: v-bind(barWidth);
    height: 16px;
    background-color: v-bind(barColor);
    margin-right: 10px;
    border-radius: 2px;
}
</style>
