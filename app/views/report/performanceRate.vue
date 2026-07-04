<template>
    <el-row class="rate-bg" :style="{ '--bar-color': barColor }">
        <span class="rate-label" :class="props.rate < 50 ? 'right' : 'left'"> {{ props.rate }}% </span>
    </el-row>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    rate: { type: Number, default: 0 }
})

const barColor = computed(() => {
    if (props.rate < 20) return "var(--el-color-danger)"
    if (props.rate < 40) return "var(--el-color-warning)"
    if (props.rate < 60) return "var(--el-color-primary)"
    return "var(--el-color-success)"
})
</script>

<style scoped>
.rate-bg {
    position: relative;
    width: 100%;
    height: 20px;
    background: linear-gradient(90deg, var(--bar-color), var(--bar-color));
    background-size: v-bind(rate + "%") 100%;
    background-repeat: no-repeat;
    border-radius: 10px;
    background-color: #e9ecef;
    transition: background-size 0.6s ease;
}

.rate-label {
    position: absolute;
    top: 50%;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    z-index: 1;
    pointer-events: none;
}

.rate-label.left {
    right: v-bind((100-rate) + "%");
    color: #fff;
    transform: translateX(-3px) translateY(-50%);
}
.rate-label.right {
    left: v-bind(rate + "%");
    color: var(--bar-color);
    transform: translateX(3px) translateY(-50%);
}
</style>
