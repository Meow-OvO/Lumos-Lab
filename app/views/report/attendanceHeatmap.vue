<template>
    <div ref="chartRef" class="chart-cell"></div>
</template>

<script setup>
import * as echarts from "echarts"
import dayjs from "dayjs"

const props = defineProps({ mapData: { type: Array, required: true, default: () => [] } })
// const range = computed(() => {
//     return dayjs(props.mapData[0]?.[0] || "").format("YYYY-MM")
// })

const range = props.mapData[0]?.[0] ? dayjs(props.mapData[0][0]).format("YYYY-MM") : dayjs().format("YYYY-MM")

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
            range: range,
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
