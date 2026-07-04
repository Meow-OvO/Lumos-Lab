<template>
    <div ref="chartRef" class="chart-cell"></div>
</template>

<script setup>
import * as echarts from "echarts"
import dayjs from "dayjs"

const props = defineProps({
    trendData: { type: Array, required: true }
})

// 生成近31天的日期列表
const dateList = computed(() => {
    const dates = []
    const start = dayjs().subtract(30, "day")
    for (let i = 0; i < 31; i++) {
        dates.push(start.add(i, "day").format("MM-DD"))
    }
    return dates
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

const initChart = () => {
    if (!chartRef.value) return
    if (chartInstance) chartInstance.dispose()

    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption({
        grid: { left: "0", right: "0", bottom: "0", top: "0" },
        xAxis: { show: false, type: "category", data: dateList.value, boundaryGap: false },
        yAxis: { type: "value", show: false, max: 16, min: 4 },
        series: {
            type: "line",
            data: props.trendData,
            smooth: true,
            symbol: "circle",
            symbolSize: 1,
            connectNulls: false,
            markLine: {
                symbol: ["none", "none"],
                data: [
                    {
                        yAxis: 8,
                        label: { show: false, formatter: "8", position: "end" },
                        lineStyle: { type: "dashed", color: "#999" }
                    }
                ]
            }
            // lineStyle: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //         { offset: 0, color: "#5470c6" },
            //         { offset: 0.1, color: "#73c0de" },
            //         { offset: 1, color: "#ee6666" }
            //     ])
            // }
        }
    })
    chartInstance.resize()
}

onMounted(() => {
    initChart()
    resizeObserver = new ResizeObserver(() => chartInstance?.resize())
    resizeObserver.observe(chartRef.value)
})

watch(
    () => props.trendData,
    () => initChart(),
    { deep: true }
)

onBeforeUnmount(() => {
    chartInstance?.dispose()
    resizeObserver?.disconnect()
})
</script>

<style scoped>
.chart-cell {
    width: 100%;
    height: 24px;
}
</style>
