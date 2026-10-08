import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface WeekRange {
    weekNumber: number
    startDate: string
    endDate: string
    label: string
}

export function getWeeksOfMonth(year: number, month: number): WeekRange[] {
    const rawWeeks: { startDate: Date; endDate: Date; count: number }[] = []
    const lastDay = new Date(year, month, 0)
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const monthLabel = months[month - 1] || ""

    const formatDateIso = (date: Date): string => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    let weekStart = new Date(year, month - 1, 1)
    let workDayCount = 0

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const currentDate = new Date(year, month - 1, d)
        const dayOfWeek = currentDate.getDay()

        if (dayOfWeek !== 0) {
            workDayCount++
        }

        if (currentDate.getDate() > 1 && dayOfWeek === 1) {
            weekStart = new Date(currentDate)
            workDayCount = 1
        }

        if (dayOfWeek === 6 || d === lastDay.getDate()) {
            rawWeeks.push({
                startDate: new Date(weekStart),
                endDate: new Date(currentDate),
                count: workDayCount
            })
        }
    }

    if (rawWeeks.length > 1 && rawWeeks[0].count < 3) {
        const first = rawWeeks.shift()!
        rawWeeks[0].startDate = first.startDate
        rawWeeks[0].count += first.count
    }

    if (rawWeeks.length > 1 && rawWeeks[rawWeeks.length - 1].count < 3) {
        const last = rawWeeks.pop()!
        rawWeeks[rawWeeks.length - 1].endDate = last.endDate
        rawWeeks[rawWeeks.length - 1].count += last.count
    }

    return rawWeeks.map((w, index) => {
        const weekNum = index + 1
        const startDay = w.startDate.getDate()
        const endDay = w.endDate.getDate()
        return {
            weekNumber: weekNum,
            startDate: formatDateIso(w.startDate),
            endDate: formatDateIso(w.endDate),
            label: `Minggu ${weekNum} (${startDay} - ${endDay} ${monthLabel})`
        }
    })
}

