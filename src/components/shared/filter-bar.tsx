"use client"

import { Input } from "@/components/ui/input"
import { WeekRange } from "@/lib/utils"

interface FilterBarProps {
    selectedMonth: string
    setSelectedMonth: (month: string) => void
    selectedDate: string
    setSelectedDate: (date: string) => void
    selectedWeek: string
    setSelectedWeek: (week: string) => void
    weeks: WeekRange[]
}

const MONTHS = [
    { value: "all", label: "Semua Bulan" },
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" }
]

export default function FilterBar({
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    selectedWeek,
    setSelectedWeek,
    weeks
}: FilterBarProps) {
    const hasWeeks = selectedMonth !== "all" && weeks.length > 0
    
    return (
        <div className={`grid gap-4 w-full bg-white border border-neutral-200 rounded-xl p-5 shadow-sm transition-all duration-200 ${
            hasWeeks ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
        }`}>
            <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Saring Bulan</span>
                <select
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value)
                        setSelectedWeek("all")
                    }}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-neutral-400"
                >
                    {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>
            
            {hasWeeks && (
                <div className="flex flex-col gap-1.5 w-full animate-in fade-in slide-in-from-top-1 duration-150">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Pilih Minggu</span>
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-neutral-400"
                    >
                        <option value="all">Semua Minggu</option>
                        {weeks.map((w) => (
                            <option key={w.weekNumber} value={w.weekNumber.toString()}>
                                {w.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Tanggal Spesifik</span>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value)
                        if (e.target.value) {
                            setSelectedMonth("all")
                            setSelectedWeek("all")
                        }
                    }}
                    className="h-10 text-sm border-neutral-200 bg-white focus-visible:border-neutral-400 focus-visible:ring-0 w-full"
                />
            </div>
        </div>
    )
}
