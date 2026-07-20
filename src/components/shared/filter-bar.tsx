"use client"

import { Input } from "@/components/ui/input"

interface FilterBarProps {
    selectedMonth: string
    setSelectedMonth: (month: string) => void
    selectedDate: string
    setSelectedDate: (date: string) => void
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
    setSelectedDate
}: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-between bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col gap-2 w-full sm:w-auto flex-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Saring Berdasarkan Bulan</span>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-neutral-400 min-w-[200px]"
                >
                    {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto flex-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Pilih Tanggal Spesifik</span>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-10 text-sm border-neutral-200 bg-white focus-visible:border-neutral-400 focus-visible:ring-0 w-full"
                />
            </div>
        </div>
    )
}
