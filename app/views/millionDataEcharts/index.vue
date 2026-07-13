<script lang="ts" setup>
import type { DataPoint } from "./types.d.ts"

import millionDataHandlerWorker from "./millionDataHandler.worker.ts?worker"
import * as echarts from "echarts"
import dayjs from "dayjs"

let worker: Worker
let observer: ResizeObserver

let millionLineGraph: echarts.ECharts
let millionLineLttbGraph: echarts.ECharts

const generateCount = ref(1200000)
const lttbCount = ref(2000)

const millionData = ref<DataPoint[]>([])
const millionDataForGraph = ref<[string, number][]>([])
const millionDataForLttbGraph = ref<[string, number][]>([])
const currentPageData = computed(() => {
    const start = (pagination.current - 1) * pagination.size
    const end = Math.min(start + pagination.size, millionData.value.length)
    return millionData.value.slice(start, end)
})

const pagination = reactive({ current: 1, size: 20, total: 0 })

const millionLineLttbGraphEl = useTemplateRef("million-line-lttb-graph")
const millionLineGraphEl = useTemplateRef("million-line-graph")

const timingContent: Record<string, string> = reactive({ generate: "", calculate: "", lttbRender: "", normalRender: "" })

const setupMillionData = () => {
    millionData.value = []
    millionDataForLttbGraph.value = []
    millionDataForGraph.value = []
    millionLineGraph.showLoading({ text: "😊使用左侧操作生成图形", fontSize: 14, showSpinner: false })
    millionLineLttbGraph.showLoading({ text: "😊使用左侧操作生成图形", fontSize: 14, showSpinner: false })

    if (worker) worker.terminate()

    worker = new millionDataHandlerWorker()

    worker.postMessage({ type: "generate", generateCount: generateCount.value })

    worker.onmessage = event => {
        if (event.data.type === "generateProgress") {
            timingContent.generate = `生成中 ${event.data.progress}%`
        } else if (event.data.type === "calculateProgress") {
            timingContent.calculate = `处理中 ${event.data.progress}%`
        } else if (event.data.type === "generateComplete") {
            millionData.value = event.data.records
            pagination.total = millionData.value.length
            timingContent.generate = `生成耗时 ${event.data.time}ms`
        } else if (event.data.type === "calculateComplete") {
            millionDataForGraph.value = event.data.records
            millionDataForLttbGraph.value = event.data.lttbRecords
            timingContent.calculate = `处理耗时 ${event.data.time}ms`
        }
    }
}

const calcMillionData = () => {
    millionDataForLttbGraph.value = []
    millionDataForGraph.value = []

    worker.postMessage({ type: "calculate", lttbTarget: lttbCount.value })
}

// const graphResize = () => {
//     if (millionLineGraph) millionLineGraph.resize()
//     if (millionLineLttbGraph) millionLineLttbGraph.resize()
// }

const setupObserver = () => {
    observer = new ResizeObserver(entries => {
        entries.forEach(entry => {
            // console.log(entry.target.id, entry.contentRect)
            if (millionLineGraph) millionLineGraph.resize()
            if (millionLineLttbGraph) millionLineLttbGraph.resize()
        })
    })

    const elements = [millionLineLttbGraphEl.value, millionLineGraphEl.value]
    elements.forEach(el => observer.observe(el as Element))
}

const setupGraph = () => {
    const dataLength = millionDataForGraph.value.length

    const startTime = performance.now()

    millionLineGraph.setOption({
        legend: { bottom: 0, left: "center" },
        tooltip: { trigger: "axis", transitionDuration: 0 },
        grid: { left: 0, right: 0, bottom: 0, top: 10, containLabel: true },
        dataset: { source: millionDataForGraph.value },
        xAxis: {
            type: "category",
            boundaryGap: false,
            axisTick: { interval: (index: number) => index === 0 || index === dataLength - 1 },
            axisLabel: {
                formatter: (value: string, index: number) => {
                    if (index === 0 || index === dataLength - 1) return dayjs(value).format("YYYY-MM-DD\nHH:mm")
                    else return ""
                },
                showMinLabel: true,
                alignMinLabel: "left",
                showMaxLabel: true,
                alignMaxLabel: "right"
            }
        },
        yAxis: { type: "value", scale: true },
        animation: false,
        series: {
            name: "原始点",
            type: "line",
            showSymbol: false,
            lineStyle: { width: 1 },
            // 对于百万级数据，progressive 建议调大
            progressive: 1000,
            // 启用渐进式渲染
            progressiveThreshold: 3000
        }
    })

    millionLineGraph.hideLoading()

    requestAnimationFrame(() => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        timingContent.normalRender = `图表渲染耗时：${renderTime.toFixed(2)}ms`
    })
}

const setupLttbGraph = () => {
    const dataLength = millionDataForLttbGraph.value.length

    const startTime = performance.now()

    millionLineLttbGraph.setOption({
        legend: { bottom: 0, left: "center" },
        tooltip: { trigger: "axis", transitionDuration: 0 },
        grid: { left: 0, right: 0, bottom: 0, top: 10, containLabel: true },
        dataset: { source: millionDataForLttbGraph.value },

        xAxis: {
            type: "category",
            boundaryGap: false,
            axisTick: { interval: (index: number) => index === 0 || index === dataLength - 1 },
            axisLabel: {
                formatter: (value: string, index: number) => {
                    if (index === 0 || index === dataLength - 1) return dayjs(value).format("YYYY-MM-DD\nHH:mm")
                    else return ""
                },
                showMinLabel: true,
                alignMinLabel: "left",
                showMaxLabel: true,
                alignMaxLabel: "right"
            }
        },
        yAxis: { type: "value", scale: true },
        animation: false,
        series: {
            name: "采集点",
            type: "line",
            showSymbol: false,
            lineStyle: { width: 1 },
            // 对于百万级数据，progressive 建议调大
            progressive: 1000,
            // 启用渐进式渲染
            progressiveThreshold: 3000
        }
    })

    requestAnimationFrame(() => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        timingContent.lttbRender = `图表渲染耗时：${renderTime.toFixed(2)}ms`
    })

    millionLineLttbGraph.hideLoading()
}

onMounted(() => {
    millionLineGraph = echarts.init(millionLineGraphEl.value)
    millionLineGraph.showLoading({ text: "😊使用左侧操作生成图形", fontSize: 14, showSpinner: false })

    millionLineLttbGraph = echarts.init(millionLineLttbGraphEl.value)
    millionLineLttbGraph.showLoading({ text: "😊使用左侧操作生成图形", fontSize: 14, showSpinner: false })

    // window.addEventListener("resize", graphResize)

    setupObserver()
})

onBeforeUnmount(() => {
    if (worker) worker.terminate()
    if (observer) observer.disconnect()

    // window.removeEventListener("resize", graphResize)
})
</script>

<template>
    <div class="p-3">
        <el-row :gutter="12">
            <el-col :span="12">
                <el-card class="mb-3">
                    <el-custom-card-title>操作</el-custom-card-title>

                    <el-row class="text-[14px] mb-3">🌀 生成模拟数据 , 生成和处理操作都会经过 Web Worker , 不会阻塞线程</el-row>

                    <el-input
                        v-model="generateCount"
                        type="number"
                        :style="{ width: '260px' }"
                        class="mr-3"
                        @input="lttbCount = Math.ceil(generateCount / 10) > 2000 ? 2000 : Math.ceil(generateCount / 10)"
                    >
                        <template #prepend>生成</template>
                        <template #append>条数据</template>
                    </el-input>

                    <el-button type="primary" :icon="DataLine" class="mr-3" @click="setupMillionData"> 开始生成数据 </el-button>

                    <span class="text-[14px]">{{ timingContent.generate }}</span>

                    <el-divider :style="{ margin: '18px 0 14px' }" />

                    <el-row class="text-[14px] mb-3"
                        >✂️ 数据处理 , Web Worker 会处理并返回一个经过降采的数据和一个没有经过降采的数据 , 模拟数据返回后的处理过程</el-row
                    >

                    <el-input v-model="lttbCount" type="number" :style="{ width: '260px' }" class="mr-3">
                        <template #prepend>采集</template>
                        <template #append>点</template>
                    </el-input>

                    <el-button type="primary" class="mr-3" :disabled="!millionData.length" :icon="Cpu" @click="calcMillionData">
                        将数据处理为 Echarts 渲染需要的格式
                    </el-button>

                    <span class="text-[14px]">{{ timingContent.calculate }}</span>

                    <el-divider :style="{ margin: '18px 0 14px' }" />

                    <el-row class="text-[14px] mb-3">🎯 将降采后的数据渲染为 Echarts</el-row>

                    <el-button type="primary" class="mr-3" :disabled="!millionDataForLttbGraph.length" :icon="MagicStick" @click="setupLttbGraph">
                        生成 lttb 降采图形
                    </el-button>

                    <span class="text-[14px]">{{ timingContent.lttbRender }}</span>

                    <el-divider :style="{ margin: '18px 0 14px' }" />

                    <el-row class="text-[14px] mb-3">💥 将没有经过降采的数据渲染为 Echarts , 如果生成数据过多可能会造成浏览器严重卡顿</el-row>

                    <el-button type="danger" class="mr-3" :icon="Warning" :disabled="!millionDataForGraph.length" @click="setupGraph">
                        生成无优化图形 , 仅使用 Echarts 渐进式渲染功能进行优化
                    </el-button>

                    <span class="text-[14px]">{{ timingContent.normalRender }}</span>
                </el-card>

                <el-card>
                    <el-custom-card-title>数据</el-custom-card-title>

                    <el-table :data="currentPageData" border height="calc(100vh - 707px)">
                        <el-table-column prop="date" label="Date" />
                        <el-table-column prop="value" label="Value" />
                    </el-table>

                    <el-pagination
                        v-model:current-page="pagination.current"
                        v-model:page-size="pagination.size"
                        background
                        prev-text="&nbsp;⬅️&nbsp;上一页&nbsp;&nbsp;"
                        next-text="&nbsp;&nbsp;下一页&nbsp;➡️&nbsp;"
                        layout="total, sizes, prev, next, jumper"
                        :total="pagination.total"
                        class="pt-5"
                    />
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card class="mb-3">
                    <el-custom-card-title>关于本页面</el-custom-card-title>

                    <!-- height="calc((100vh - 534px) / 3)" -->
                    <el-scrollbar class="page-about">
                        <el-row class="text-[14px]">🎈 大量数据的计算工作使用 Web Worker 处理 , 处理时不会阻塞线程 , 实测在 1000 万条数据下表现良好</el-row>

                        <el-row class="mt-2 text-[14px]"
                            >🧀 图形自适应使用 ResizeObserver 实现 , 在容器大小变化而窗口未变化时 , 具备比监听 resize 事件更好的表现 ,
                            可通过左上角的菜单缩放功能进行测试 ( 渲染了无优化图形的情况下 , 页面可能卡顿 )</el-row
                        >

                        <el-row class="mt-2 text-[14px]"
                            >😈 由于参数传递时 , Web Worker 同步将未进行采样的原始数据传递回了主线程用于展示和采样前后图形对比测试 , 因此数据量巨大的情况下 ,
                            在数据生成和处理结束的节点依然会有明显的卡顿感 , 在生产环境下应当避免在线程间传递如此巨大的数据或使用 Transferable /
                            SharedArrayBuffer 进行优化</el-row
                        >
                    </el-scrollbar>
                </el-card>

                <el-card class="mb-3">
                    <el-custom-card-title>lttb 降采图形</el-custom-card-title>

                    <div ref="million-line-lttb-graph" class="million-line-lttb-graph"></div>
                </el-card>

                <el-card>
                    <el-custom-card-title>无优化图形</el-custom-card-title>

                    <div ref="million-line-graph" class="million-line-graph"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.page-about {
    width: 100%;
    height: calc((100vh - 380px) * 2 / 8);
}

.million-line-graph,
.million-line-lttb-graph {
    width: 100%;
    height: calc((100vh - 391px) * 3 / 8);
}
</style>
