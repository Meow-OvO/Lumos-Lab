<script setup lang="ts">
import _ from "lodash"
import employeeWorker from "./employee.worker.ts?worker"

import attendanceHeatmap from "./attendanceHeatmap.vue"
import maskPhone from "./maskPhone.vue"
import weeklyHoursTrend from "./weeklyHoursTrend.vue"

import type { TableRowData } from "./type.d.ts"

const totalCount = ref(0)

const loading = ref(false)
const progress = ref(0)

// 普通响应式数组，移除markRaw
const tableData = ref<TableRowData[]>([])
const currentPageTableData = computed(() => {
    const start = (pagination.current - 1) * pagination.size
    const end = Math.min(start + pagination.size, tableData.value.length)
    return tableData.value.slice(start, end)
})

const pagination = reactive({ current: 1, size: 20, total: 0 })

let worker: Worker

// 放入宏任务，强制让出主线程事件循环
const handleChunk = (list: TableRowData[], chunkProgress: number, isFinished: boolean) => {
    setTimeout(() => {
        tableData.value.push(...list)
        progress.value = chunkProgress

        if (isFinished) {
            loading.value = false
            pagination.total = tableData.value.length
            worker?.terminate()
        }
    }, 0)
}

const setupWorker = () => {
    worker = new employeeWorker()

    worker.onmessage = e => {
        const { list, finished, progress: chunkProgress } = e.data
        handleChunk(list, chunkProgress, finished)
    }

    worker.onerror = err => {
        loading.value = false
        console.error("Worker 执行异常：", err)
        worker?.terminate()
    }
}

const startWorker = (min: number, max: number) => {
    setupWorker()

    loading.value = true

    totalCount.value = _.random(min, max)

    worker.postMessage({ type: "start", total: totalCount.value })
}

onMounted(() => {
    // setupWorker()
    // worker.postMessage({ type: "start", total: totalCount })

    startWorker(1000, 2000)
})

onUnmounted(() => {
    if (worker) worker.terminate()
})
</script>

<template>
    <el-card class="m-5 box-border">
        <el-row class="content-container flex-col">
            <el-custom-card-title>员工信息列表</el-custom-card-title>

            <!-- <el-alert type="info" :closable="false"> -->
            <!-- <span class="mr-3">使用webworker生成数据, 生成过程切片优化, 不会阻塞操作. </span> -->
            <!-- <span class="underline cursor-pointer text-blue-400 mr-3" @click="startWorker(2000, 4000)"> 点击生成数据 </span> -->
            <!-- <span class="underline cursor-pointer text-blue-400" @click="startWorker(1000000, 2000000)"> 点击生成1000000~2000000条数据 </span> -->
            <!-- <br /> -->
            <!-- <span v-if="progress"> 正在生成数据, 已加载 {{ progress }} / {{ totalCount }} 条 </span> -->
            <!-- </el-alert> -->
            <!-- style="width: 100%" -->
            <!-- :fit="false" -->
            <div class="mt-4 relative overflow-hidden w-full" :style="{ flex: 1 }">
                <el-table
                    v-loading="loading"
                    element-loading-text="✨正在加载..."
                    :data="currentPageTableData"
                    border
                    class="absolute inset-0"
                    height="100%"
                    show-overflow-tooltip
                >
                    <el-custom-table-column prop="id" label="ID" fixed="left">
                        <template #default="{ row }">
                            <el-row align="middle" justify="center">
                                <span class="mr-1">{{ row.id }}</span>
                                <clipboard-button :copyContent="row.id" />
                            </el-row>
                        </template>
                    </el-custom-table-column>
                    <el-custom-table-column prop="name" label="姓名" fixed="left" />
                    <el-custom-table-column prop="email" label="邮箱" width="240">
                        <template #default="{ row }">
                            <el-link :href="`mailto:${row.email}`" type="primary">
                                {{ row.email }}
                            </el-link>
                        </template>
                    </el-custom-table-column>
                    <el-custom-table-column prop="phone" label="手机号" width="140">
                        <template #default="{ row }">
                            <maskPhone :key="row.id" :phone="row.phone" />
                        </template>
                    </el-custom-table-column>
                    <el-custom-table-column prop="department" label="部门" width="100" />
                    <el-custom-table-column prop="position" label="职位" width="100" />

                    <!-- <el-custom-table-column label="上月出勤热力" width="110" :show-overflow-tooltip="false">
                        <template #default="{ row }">
                            <attendanceHeatmap :mapData="row.lastMonthAttendanceData" />
                        </template>
                    </el-custom-table-column> -->

                    <el-custom-table-column label="近31天出勤时长" :show-overflow-tooltip="false">
                        <template #default="{ row }">
                            <weeklyHoursTrend :key="row.id" />
                        </template>
                    </el-custom-table-column>

                    <el-custom-table-column label="近2月出勤热力" :show-overflow-tooltip="false">
                        <template #default="{ row }">
                            <attendanceHeatmap :key="row.id" />
                        </template>
                    </el-custom-table-column>

                    <el-custom-table-column label="近2月季度绩效">
                        <el-custom-table-column prop="performanceSeason_1" label="本季度" />
                        <el-custom-table-column prop="performanceSeason_2" label="上季度" />
                    </el-custom-table-column>

                    <el-custom-table-column prop="salary" label="薪资" width="100">
                        <template #default="{ row }">¥{{ row.salary.toLocaleString() }}</template>
                    </el-custom-table-column>
                    <el-custom-table-column prop="status" label="状态" width="80">
                        <template #default="{ row }">
                            <el-tag :type="row.status === '在职' ? 'success' : 'danger'">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-custom-table-column>
                    <el-custom-table-column prop="createdAt" label="入职日期" />
                    <el-custom-table-column label="操作" width="120" fixed="right">
                        <el-link type="primary" class="mr-2">
                            <el-tooltip effect="dark" content="详情" placement="bottom">
                                <el-icon><View /></el-icon>
                            </el-tooltip>
                            <!-- <span>详情</span> -->
                        </el-link>
                        <el-link type="primary" class="mr-2">
                            <el-tooltip effect="dark" content="编辑" placement="bottom">
                                <el-icon><Edit /></el-icon>
                            </el-tooltip>
                            <!-- <span>编辑</span> -->
                        </el-link>
                        <el-link type="primary" class="mr-2">
                            <el-tooltip effect="dark" content="删除" placement="bottom">
                                <el-icon><Delete /></el-icon>
                            </el-tooltip>
                            <!-- <span>删除</span> -->
                        </el-link>
                        <el-link type="primary">
                            <el-tooltip effect="dark" content="重置密码" placement="bottom">
                                <el-icon><Unlock /></el-icon>
                            </el-tooltip>
                            <!-- <span>重置密码</span> -->
                        </el-link>
                    </el-custom-table-column>
                </el-table>
            </div>

            <el-pagination
                v-model:current-page="pagination.current"
                v-model:page-size="pagination.size"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                class="mt-4"
                @size-change="pagination.current = 1"
            />
        </el-row>
    </el-card>
</template>

<style scoped>
.content-container {
    height: calc(100vh - 142px);
}
</style>
