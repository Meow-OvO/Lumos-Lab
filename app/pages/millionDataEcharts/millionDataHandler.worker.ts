// worker.ts

import dayjs from "dayjs"
import type { DataPoint } from "./types.d.ts"

// 常量定义
const INITIAL_VALUE = 30
const BASE_CHANGE_RANGE = 1 // ±0.5
const JUMP_PROBABILITY = 0.05

/**
 * LTTB (Largest Triangle Three Buckets) 降采样算法 - 修复重复数据问题
 */
const lttb = (data: [string, number][], targetCount: number): [string, number][] => {
    const dataLength = data.length

    // 如果目标数 >= 数据长度，直接返回原数据
    if (targetCount >= dataLength) {
        return data
    }

    // 如果目标数 < 3，返回首尾
    if (targetCount < 3) {
        return [data[0]!, data[dataLength - 1]!]
    }

    // 始终保留第一个和最后一个点
    const sampled: [string, number][] = [data[0]!]
    const selectedIndices = new Set<number>([0, dataLength - 1])

    let a = 0 // 前一个选定点的索引
    const bucketCount = targetCount - 2 // 需要选择的 bucket 数量

    // 使用 Math.floor 计算 bucket 大小
    const bucketSize = (dataLength - 2) / bucketCount

    for (let i = 0; i < bucketCount; i++) {
        // 计算当前 bucket 的范围
        const bucketStart = Math.floor(i * bucketSize) + 1
        const bucketEnd = Math.floor((i + 1) * bucketSize) + 1

        // 修正边界，确保不超出数据范围
        const start = Math.min(bucketStart, dataLength - 1)
        const end = Math.min(bucketEnd, dataLength)

        // 如果 bucket 为空，选择相邻的未选中点
        if (start >= end) {
            // 找最近的未选中点
            let fallbackIndex = -1
            for (let j = start - 1; j >= 0; j--) {
                if (!selectedIndices.has(j)) {
                    fallbackIndex = j
                    break
                }
            }
            if (fallbackIndex === -1) {
                for (let j = start; j < dataLength; j++) {
                    if (!selectedIndices.has(j)) {
                        fallbackIndex = j
                        break
                    }
                }
            }
            if (fallbackIndex !== -1) {
                sampled.push(data[fallbackIndex]!)
                selectedIndices.add(fallbackIndex)
                a = fallbackIndex
            }
            continue
        }

        // 计算 bucket 的平均值点
        let sumX = 0
        let sumY = 0
        let count = 0

        for (let j = start; j < end; j++) {
            if (!selectedIndices.has(j)) {
                sumX += j
                sumY += data[j]![1]
                count++
            }
        }

        // 如果 bucket 中所有点都被选中了，跳过
        if (count === 0) {
            continue
        }

        const avgX = sumX / count
        const avgY = sumY / count

        // 选择 bucket 中与平均值点构成最大三角形的点
        let maxArea = -1
        let selectedIndex = start

        const aX = a
        const aY = data[a]![1]

        for (let j = start; j < end; j++) {
            if (selectedIndices.has(j)) {
                continue
            }

            const bX = j
            const bY = data[j]![1]

            const area = Math.abs((bX - aX) * (avgY - aY) - (avgX - aX) * (bY - aY))

            if (area > maxArea) {
                maxArea = area
                selectedIndex = j
            }
        }

        // 如果 selectedIndex 已经被选中（理论上不会发生），找替代
        if (selectedIndices.has(selectedIndex)) {
            for (let j = start; j < end; j++) {
                if (!selectedIndices.has(j)) {
                    selectedIndex = j
                    break
                }
            }
        }

        // 如果仍然找不到合适的点，跳过
        if (selectedIndices.has(selectedIndex)) {
            continue
        }

        sampled.push(data[selectedIndex]!)
        selectedIndices.add(selectedIndex)
        a = selectedIndex
    }

    // 确保最后一个点被添加
    const lastIndex = dataLength - 1
    if (!selectedIndices.has(lastIndex)) {
        sampled.push(data[lastIndex]!)
    }

    return sampled
}

/**
 * 生成模拟数据点
 */
const generateMillionData = (points: number): DataPoint[] => {
    const result: DataPoint[] = new Array(points)
    const endTime = dayjs().second(0).millisecond(0)
    const startTime = endTime.subtract(points - 1, "minute")

    let prevValue = INITIAL_VALUE
    let lastReportProgress = 0

    for (let i = 0; i < points; i++) {
        const currentTime = startTime.add(i, "minute")
        const dateStr = currentTime.format("YYYY-MM-DD HH:mm")

        let change = (Math.random() - 0.5) * BASE_CHANGE_RANGE
        if (Math.random() < JUMP_PROBABILITY) {
            change += (Math.random() - 0.5) * 4
        }

        prevValue += change
        const value = Math.round(prevValue * 10) / 10
        result[i] = { date: dateStr, value }

        const currentProgress = Math.floor(((i + 1) / points) * 100)
        if (currentProgress > lastReportProgress) {
            self.postMessage({
                type: "generateProgress",
                stage: "generating",
                progress: currentProgress
            })
            lastReportProgress = currentProgress
        }
    }

    self.postMessage({
        type: "generateProgress",
        stage: "generating",
        progress: 100
    })

    return result
}

/**
 * 转换数据格式为元组数组，并生成LTTB优化版本
 */
const setupDataFormat = (
    data: DataPoint[],
    lttbTarget: number = 2000
): {
    allData: [string, number][]
    lttbData: [string, number][]
    lttbTargetUsed: number
} => {
    const total = data.length
    const result: [string, number][] = new Array(total)
    let lastReportProgress = 0

    // 第一步：格式化所有数据
    for (let i = 0; i < total; i++) {
        result[i] = [data[i]!.date, data[i]!.value]

        const currentProgress = Math.floor(((i + 1) / total) * 100)
        if (currentProgress > lastReportProgress) {
            self.postMessage({
                type: "calculateProgress",
                stage: "formatting",
                progress: Math.floor(currentProgress / 2)
            })
            lastReportProgress = currentProgress
        }
    }

    self.postMessage({
        type: "calculateProgress",
        stage: "formatting",
        progress: 50
    })

    // 第二步：LTTB降采样
    const actualTarget = Math.min(lttbTarget, result.length)
    const targetPoints = result.length > actualTarget ? actualTarget : result.length

    // console.log(`[Worker] 原始数据: ${result.length} 条, LTTB目标: ${actualTarget} 条`)

    const lttbResult = lttb(result, targetPoints)

    // 验证LTTB结果没有重复时间戳
    // const lttbDates = new Set(lttbResult.map(item => item[0]))
    // if (lttbDates.size !== lttbResult.length) {
    //     console.warn(`[Worker] LTTB结果发现重复: ${lttbResult.length - lttbDates.size} 个重复时间戳`)
    // }

    self.postMessage({
        type: "calculateProgress",
        stage: "formatting",
        progress: 100
    })

    return {
        allData: result,
        lttbData: lttbResult,
        lttbTargetUsed: targetPoints
    }
}

// Worker 状态
let millionData: DataPoint[] = []

// Worker 消息处理
self.onmessage = (event: MessageEvent) => {
    const { type, generateCount, lttbTarget } = event.data

    try {
        if (type === "generate") {
            console.log(`[Worker] 开始生成 ${generateCount} 条数据...`)

            self.postMessage({
                type: "generateProgress",
                stage: "generating",
                progress: 0
            })

            const genStart = Date.now()
            millionData = generateMillionData(generateCount)
            const genTime = Date.now() - genStart

            // 验证数据唯一性
            const uniqueDates = new Set(millionData.map(d => d.date))
            console.log(`[Worker] 生成完成: ${millionData.length} 条数据, 唯一时间戳: ${uniqueDates.size}, 耗时: ${genTime}ms`)

            self.postMessage({
                type: "generateComplete",
                records: millionData,
                totalRecords: millionData.length,
                uniqueRecords: uniqueDates.size,
                time: genTime ? genTime : "< 1"
            })
        } else if (type === "calculate") {
            console.log("[Worker] 开始计算...")

            if (!millionData || millionData.length === 0) {
                self.postMessage({
                    type: "error",
                    message: "没有数据可计算，请先生成数据"
                })
                return
            }

            self.postMessage({
                type: "calculateProgress",
                stage: "formatting",
                progress: 0
            })

            const calcStart = Date.now()
            const formattedData = setupDataFormat(millionData, lttbTarget || 2000)
            const calcTime = Date.now() - calcStart

            // 最终验证：确保LTTB结果中没有重复
            const finalCheck = new Set(formattedData.lttbData.map(item => item[0]))
            const hasDuplicates = finalCheck.size !== formattedData.lttbData.length

            console.log(`[Worker] 计算完成: 完整数据 ${formattedData.allData.length} 条, LTTB采样 ${formattedData.lttbData.length} 条, 耗时: ${calcTime}ms`)
            if (hasDuplicates) {
                console.warn(`[Worker] 警告: LTTB结果仍有 ${formattedData.lttbData.length - finalCheck.size} 个重复时间戳`)
            } else {
                console.log(`[Worker] ✓ LTTB结果无重复时间戳`)
            }

            self.postMessage({
                type: "calculateComplete",
                records: formattedData.allData,
                lttbRecords: formattedData.lttbData,
                totalRecords: formattedData.allData.length,
                lttbRecordsCount: formattedData.lttbData.length,
                lttbTargetUsed: formattedData.lttbTargetUsed,
                hasDuplicates: hasDuplicates,
                time: calcTime ? calcTime : "< 1"
            })
        } else {
            self.postMessage({
                type: "error",
                message: `未知消息类型: ${type}`
            })
        }
    } catch (error) {
        console.error(`[Worker] 错误 (${type}):`, error)
        self.postMessage({
            type: "error",
            message: `错误: ${error instanceof Error ? error.message : String(error)}`
        })
    }
}
