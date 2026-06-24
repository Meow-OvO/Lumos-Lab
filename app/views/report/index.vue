<script setup lang="ts">
import employeeWorker from "./employee.worker.ts?worker"
import _ from "lodash"

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

const startWorker = () => {
    setupWorker()

    loading.value = true

    totalCount.value = _.random(100000, 200000)

    worker.postMessage({ type: "start", total: totalCount.value })
}

onMounted(() => {
    // setupWorker()
    // worker.postMessage({ type: "start", total: totalCount })
})

onUnmounted(() => {
    if (worker) worker.terminate()
})
</script>

<template>
    <el-card class="m-5 box-border">
        <el-row class="content-container flex-col">
            <el-custom-card-title>员工信息列表</el-custom-card-title>

            <el-alert type="info" :closable="false">
                <span>使用webworker生成数据, 生成过程切片优化, 不会阻塞操作. </span>
                <span class="underline cursor-pointer text-blue-400" @click="startWorker">点击生成数据</span>
                <br />
                <span v-if="progress"> 正在生成数据, 已加载 {{ progress }} / {{ totalCount }} 条 </span>
            </el-alert>

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
                    <el-table-column prop="id" label="ID" width="100" />
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column prop="phone" label="手机号" />
                    <el-table-column prop="company" label="公司" />
                    <el-table-column prop="department" label="部门" />
                    <el-table-column prop="position" label="职位" />
                    <el-table-column prop="salary" label="薪资">
                        <template #default="{ row }">¥{{ row.salary.toLocaleString() }}</template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template #default="{ row }">
                            <el-tag :type="row.status === '在职' ? 'success' : 'danger'">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" label="入职日期" />
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
