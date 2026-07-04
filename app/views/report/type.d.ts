export interface TableRowData {
    id: string
    name: string
    email: string
    phone: string
    department: string
    position: string
    salary: number
    status: "在职" | "离职"
    createdAt: string
    performanceSeason_1: string
    performanceSeason_2: string
    // performanceSeason_3: string
    // performanceSeason_4: string
    currentMonthAttendanceData: [string, number][]
    lastMonthAttendanceData: [string, number][]
    trendData: (number | null)[]
}
