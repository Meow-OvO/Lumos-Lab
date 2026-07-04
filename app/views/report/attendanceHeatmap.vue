<template>
    <div ref="chartRef" class="chart-cell"></div>
</template>

<script setup>
import * as echarts from "echarts"
import dayjs from "dayjs"

// const props = defineProps({ mapData: { type: Array, required: true, default: () => [] } })

const generateMonthlyData = (year, month, isCurrentMonth) => {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth()
    const today = dayjs()
    const result = []

    // 确定结束日期
    let endDay = daysInMonth
    if (isCurrentMonth) {
        // 当月：到昨天为止（今天的数据还没产生）
        const currentDay = today.date()
        endDay = Math.min(currentDay - 1, daysInMonth)
        // 如果今天是一号，则没有数据
        if (endDay < 1) return []
    }

    for (let day = 1; day <= endDay; day++) {
        const date = dayjs(`${year}-${month}-${day}`)
        const weekday = date.day() // 0=周日, 1=周一, ..., 6=周六
        const isWeekend = weekday === 0 || weekday === 6

        let value
        // 原逻辑：根据是否周末分别生成值
        if (isWeekend) {
            // 周末默认0，5%概率为1
            value = Math.random() < 0.05 ? 1 : 0
        } else {
            // 工作日默认1，5%概率为0或2
            const rand = Math.random()
            if (rand < 0.025) {
                value = 0
            } else if (rand < 0.05) {
                value = 2
            } else {
                value = 1
            }
        }

        // 简化后：直接随机输出 0、1、2
        // value = Math.floor(Math.random() * 3)

        result.push([date.format("YYYY-MM-DD"), value])
    }

    return result
}

// 获取当前日期
const now = dayjs()
const currentYear = now.year()
const currentMonth = now.month() + 1

// 计算上个月
const lastMonth = now.subtract(1, "month")
const lastMonthYear = lastMonth.year()
const lastMonthMonth = lastMonth.month() + 1

let mapData = [...generateMonthlyData(lastMonthYear, lastMonthMonth, false), ...generateMonthlyData(currentYear, currentMonth, true)]

// 计算 range：根据数据的第一项和最后一项，取它们所在月份的完整区间
const range = computed(() => {
    if (!mapData.length || !mapData[0]?.[0]) {
        // 如果没有数据，默认显示当前月
        return [dayjs().startOf("month").format("YYYY-MM-DD"), dayjs().endOf("month").format("YYYY-MM-DD")]
    }

    // 获取第一项和最后一项的日期
    const firstDate = dayjs(mapData[0][0])
    const lastDate = dayjs(mapData[mapData.length - 1][0])

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
        series: { type: "heatmap", coordinateSystem: "calendar", data: mapData }
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
    () => mapData,
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
