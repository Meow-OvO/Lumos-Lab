import { faker } from "@faker-js/faker"
import dayjs from "dayjs"

import type { TableRowData } from "./type.d.ts"

const CHUNK_SIZE = 1000
const departments = ["技术部", "市场部", "财务部", "人力资源部", "产品部", "运营部"]
const positions = ["工程师", "经理", "主管", "专员", "总监", "助理"]
const statuses: ("在职" | "离职")[] = ["在职", "离职"]
const performance = ["超出预期🚀", "符合预期✅", "待提升🌱", "不合格❌"]

// 生成月度数据
const generateMonthlyData = (year: number, month: number, isCurrentMonth: boolean): [string, number][] => {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth()
    const today = dayjs()
    const result: [string, number][] = []

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

        let value: number
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

        result.push([date.format("YYYY-MM-DD"), value])
    }

    return result
}

const createRow = (): TableRowData => {
    // 获取当前日期
    const now = dayjs()
    const currentYear = now.year()
    const currentMonth = now.month() + 1

    // 计算上个月
    const lastMonth = now.subtract(1, "month")
    const lastMonthYear = lastMonth.year()
    const lastMonthMonth = lastMonth.month() + 1

    return {
        id: faker.string.uuid().slice(0, 8),
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: `1${faker.string.numeric(10)}`,
        department: faker.helpers.arrayElement(departments),
        position: faker.helpers.arrayElement(positions),
        salary: faker.number.int({ min: 8000, max: 50000 }),
        status: faker.helpers.arrayElement(statuses),
        performanceSeason_1: faker.helpers.arrayElement(performance),
        performanceSeason_2: faker.helpers.arrayElement(performance),
        // performanceSeason_3: faker.helpers.arrayElement(performance),
        // performanceSeason_4: faker.helpers.arrayElement(performance),
        createdAt: dayjs(faker.date.past({ years: 3 }).toLocaleDateString("zh-CN")).format("YYYY-MM-DD"),
        // 新增：当月数据（1号到昨天）
        currentMonthAttendanceData: generateMonthlyData(currentYear, currentMonth, true),
        // 新增：上月数据（整个月）
        lastMonthAttendanceData: generateMonthlyData(lastMonthYear, lastMonthMonth, false)
    }
}

self.onmessage = async (e: MessageEvent<{ type: string; total: number }>) => {
    if (e.data.type !== "start") return
    faker.seed(42)

    let finishedCount = 0
    const total = e.data.total

    while (finishedCount < total) {
        const batchLen = Math.min(CHUNK_SIZE, total - finishedCount)
        const chunk: TableRowData[] = []

        for (let i = 0; i < batchLen; i++) {
            chunk.push(createRow())
        }
        finishedCount += batchLen

        self.postMessage({
            type: "chunk",
            list: chunk,
            finished: finishedCount >= total,
            progress: finishedCount
        })

        // 让出 Worker 事件循环，防止消息风暴
        await new Promise(resolve => setTimeout(resolve, 0))
    }
}
