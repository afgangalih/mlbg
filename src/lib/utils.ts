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
    const weeks: WeekRange[] = []
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    
    let currentWeekNumber = 1
    let weekStart = new Date(firstDay)
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const monthLabel = months[month - 1] || ""

    const formatDateIso = (date: Date): string => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const currentDate = new Date(year, month - 1, d)
        const dayOfWeek = currentDate.getDay()
        
        if (dayOfWeek === 0) {
            continue
        }
        
        if (currentDate.getDate() > 1 && dayOfWeek === 1) {
            weekStart = new Date(currentDate)
        }
        
        if (dayOfWeek === 6 || d === lastDay.getDate()) {
            weeks.push({
                weekNumber: currentWeekNumber,
                startDate: formatDateIso(weekStart),
                endDate: formatDateIso(currentDate),
                label: `Minggu ${currentWeekNumber} (${weekStart.getDate()} - ${currentDate.getDate()} ${monthLabel})`
            })
            currentWeekNumber++
        }
    }
    
    return weeks
}

