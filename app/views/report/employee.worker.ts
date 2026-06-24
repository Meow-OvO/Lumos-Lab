import { faker } from "@faker-js/faker"

import type { TableRowData } from "./type.d.ts"

const CHUNK_SIZE = 1000
const departments = ["技术部", "市场部", "财务部", "人力资源部", "产品部", "运营部"]
const positions = ["工程师", "经理", "主管", "专员", "总监", "助理"]
const statuses: ("在职" | "离职")[] = ["在职", "离职"]

const createRow = (): TableRowData => {
    return {
        id: faker.string.uuid().slice(0, 8),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("1-###-###-####"),
        company: faker.company.name(),
        department: faker.helpers.arrayElement(departments),
        position: faker.helpers.arrayElement(positions),
        salary: faker.number.int({ min: 8000, max: 50000 }),
        status: faker.helpers.arrayElement(statuses),
        createdAt: faker.date.past({ years: 3 }).toLocaleDateString("zh-CN")
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
