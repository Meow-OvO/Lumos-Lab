<template>
    <div ref="chartRef" class="chart-cell"></div>
</template>

<script setup>
import * as echarts from "echarts"
import dayjs from "dayjs"

const props = defineProps({ mapData: { type: Array, required: true, default: () => [] } })

// 计算 range：根据数据的第一项和最后一项，取它们所在月份的完整区间
const range = computed(() => {
    if (!props.mapData.length || !props.mapData[0]?.[0]) {
        // 如果没有数据，默认显示当前月
        return [dayjs().startOf("month").format("YYYY-MM-DD"), dayjs().endOf("month").format("YYYY-MM-DD")]
    }

    // 获取第一项和最后一项的日期
    const firstDate = dayjs(props.mapData[0][0])
    const lastDate = dayjs(props.mapData[props.mapData.length - 1][0])

    // 如果第一项和最后一项在同一个月，只显示该月
    if (firstDate.isSame(lastDate, "month")) {
        return [firstDate.startOf("month").format("YYYY-MM-DD"), firstDate.endOf("month").format("YYYY-MM-DD")]
    }

    // 如果跨月，从第一项所在月的第一天 到 最后一项所在月的最后一天
    return [firstDate.startOf("month").format("YYYY-MM-DD"), lastDate.endOf("month").format("YYYY-MM-DD")]
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return

    if (chartInstance) chartInstance.dispose()

    chartInstance = echarts.init(chartRef.value)

    const option = {
        visualMap: {
            min: 0,
            max: 2,
            type: "piecewise",
            orient: "horizontal",
            left: "center",
            top: 65,
            textStyle: { color: "#333" },
            pieces: [
                { value: 0, color: "#73c0de" }, // 未出勤 - 浅灰
                { value: 1, color: "#5470c6" }, // 出勤 - 清爽蓝
                { value: 2, color: "#ee6666" } // 出勤异常 - 柔和红
            ],
            show: false
        },
        calendar: {
            top: 0,
            left: 0,
            right: 0,
            cellSize: ["auto", "auto"],
            range: range.value, // 使用 computed 的值
            splitLine: { lineStyle: { color: "#808080" } },
            itemStyle: { borderWidth: 0, borderColor: "#e8e8e8" },
            yearLabel: { show: false },
            monthLabel: { show: false, nameMap: "en" },
            dayLabel: { show: false, nameMap: "en" }
        },
        series: { type: "heatmap", coordinateSystem: "calendar", data: props.mapData }
    }

    chartInstance.setOption(option)
    chartInstance.resize()
}

onMounted(() => {
    initChart()

    resizeObserver = new ResizeObserver(() => chartInstance?.resize())
    if (chartRef.value) resizeObserver.observe(chartRef.value)
})

// 监听 mapData 变化，重新渲染图表
watch(
    () => props.mapData,
    () => {
        initChart()
    },
    { deep: true }
)

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
    if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
    }
})
</script>

<style scoped>
.chart-cell {
    width: 100%;
    height: 24px;
    /* min-height: 40px; */
}
</style>
