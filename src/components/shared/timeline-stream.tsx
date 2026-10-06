"use client"

import { useState, useMemo } from "react"
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"
import { getWeeksOfMonth } from "@/lib/utils"

type LogbookEntry = {
    id: string
    date: string
    timeIn: string
    timeOut: string
    activity: string
    status: "Hadir" | "Sakit" | "Izin" | "Libur"
}

interface TimelineStreamProps {
    entries: LogbookEntry[]
    onEdit: (entry: LogbookEntry) => void
    onDelete: (id: string) => void
}

type GroupedWeek = {
    key: string
    weekNumber: number
    label: string
    startDate: string
    endDate: string
    entries: LogbookEntry[]
    stats: { hadir: number; sakitIzin: number; libur: number }
}

type GroupedMonth = {
    monthKey: string
    monthLabel: string
    weeks: GroupedWeek[]
}

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr + "T00:00:00")
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    } catch {
        return dateStr
    }
}

export default function TimelineStream({
    entries,
    onEdit,
    onDelete
}: TimelineStreamProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [targetEntry, setTargetEntry] = useState<{ id: string; date: string } | null>(null)
    const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>({})

    const groupedMonths = useMemo(() => {
        const monthMap = new Map<string, LogbookEntry[]>()
        
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
        
        for (const entry of sorted) {
            if (!entry.date) continue
            const monthKey = entry.date.substring(0, 7)
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, [])
            }
            monthMap.get(monthKey)!.push(entry)
        }

        const months: GroupedMonth[] = []
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

        for (const [monthKey, monthEntries] of monthMap.entries()) {
            const [yearStr, monthStr] = monthKey.split("-")
            const year = parseInt(yearStr, 10)
            const month = parseInt(monthStr, 10)
            const monthLabel = `${monthNames[month - 1] || "Bulan"} ${year}`

            const weekRanges = getWeeksOfMonth(year, month)
            const weekMap = new Map<string, LogbookEntry[]>()
            const weekMetaMap = new Map<string, { weekNumber: number; label: string; startDate: string; endDate: string }>()
            const otherEntries: LogbookEntry[] = []

            for (const entry of monthEntries) {
                const matchedWeek = weekRanges.find(w => entry.date >= w.startDate && entry.date <= w.endDate)
                if (matchedWeek) {
                    const wKey = `${monthKey}-W${matchedWeek.weekNumber}`
                    if (!weekMap.has(wKey)) {
                        weekMap.set(wKey, [])
                        weekMetaMap.set(wKey, {
                            weekNumber: matchedWeek.weekNumber,
                            label: matchedWeek.label,
                            startDate: matchedWeek.startDate,
                            endDate: matchedWeek.endDate
                        })
                    }
                    weekMap.get(wKey)!.push(entry)
                } else {
                    otherEntries.push(entry)
                }
            }

            const weeks: GroupedWeek[] = []

            for (const [wKey, wEntries] of weekMap.entries()) {
                const meta = weekMetaMap.get(wKey)!
                let hadir = 0, sakitIzin = 0, libur = 0
                for (const e of wEntries) {
                    if (e.status === "Hadir") hadir++
                    else if (e.status === "Sakit" || e.status === "Izin") sakitIzin++
                    else libur++
                }
                weeks.push({
                    key: wKey,
                    weekNumber: meta.weekNumber,
                    label: meta.label,
                    startDate: meta.startDate,
                    endDate: meta.endDate,
                    entries: wEntries.sort((a, b) => b.date.localeCompare(a.date)),
                    stats: { hadir, sakitIzin, libur }
                })
            }

            if (otherEntries.length > 0) {
                let hadir = 0, sakitIzin = 0, libur = 0
                for (const e of otherEntries) {
                    if (e.status === "Hadir") hadir++
                    else if (e.status === "Sakit" || e.status === "Izin") sakitIzin++
                    else libur++
                }
                weeks.push({
                    key: `${monthKey}-W-other`,
                    weekNumber: 99,
                    label: `Kegiatan Lainnya (${monthLabel})`,
                    startDate: "",
                    endDate: "",
                    entries: otherEntries.sort((a, b) => b.date.localeCompare(a.date)),
                    stats: { hadir, sakitIzin, libur }
                })
            }

            weeks.sort((a, b) => b.weekNumber - a.weekNumber)

            months.push({
                monthKey,
                monthLabel,
                weeks
            })
        }

        return months
    }, [entries])

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 border border-dashed border-neutral-200 rounded-xl bg-white text-center">
                <span className="text-sm font-semibold text-neutral-500">Belum ada riwayat kegiatan magang</span>
                <span className="text-xs text-neutral-400 mt-1.5 max-w-[280px] leading-relaxed">
                    Silakan isi form di sisi kanan untuk mulai mencatat logbook harian pertama Anda.
                </span>
            </div>
        )
    }

    const isWeekOpen = (key: string, isDefaultOpen: boolean) => {
        if (openWeeks[key] !== undefined) {
            return openWeeks[key]
        }
        return isDefaultOpen
    }

    const toggleWeek = (key: string, isDefaultOpen: boolean) => {
        const current = isWeekOpen(key, isDefaultOpen)
        setOpenWeeks(prev => ({ ...prev, [key]: !current }))
    }

    const toggleAll = (open: boolean) => {
        const nextState: Record<string, boolean> = {}
        for (const m of groupedMonths) {
            for (const w of m.weeks) {
                nextState[w.key] = open
            }
        }
        setOpenWeeks(nextState)
    }

    const triggerDeleteConfirm = (id: string, date: string) => {
        setTargetEntry({ id, date })
        setConfirmOpen(true)
    }

    const executeDelete = () => {
        if (targetEntry) {
            onDelete(targetEntry.id)
            setConfirmOpen(false)
            setTargetEntry(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    <span>Riwayat Kegiatan</span>
                    <span className="bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {entries.length} Catatan
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleAll(true)}
                        className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Buka Semua
                    </button>
                    <span className="text-neutral-300 text-xs">•</span>
                    <button
                        type="button"
                        onClick={() => toggleAll(false)}
                        className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Tutup Semua
                    </button>
                </div>
            </div>

            {groupedMonths.map((mGroup, mIdx) => (
                <div key={mGroup.monthKey} className="space-y-3">
                    <div className="flex items-center gap-3 pt-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 shrink-0">
                            {mGroup.monthLabel}
                        </h3>
                        <div className="h-px bg-neutral-200 flex-1" />
                    </div>

                    <div className="space-y-3">
                        {mGroup.weeks.map((wGroup, wIdx) => {
                            const isDefaultOpen = mIdx === 0 && wIdx === 0
                            const isOpen = isWeekOpen(wGroup.key, isDefaultOpen)

                            return (
                                <div
                                    key={wGroup.key}
                                    className="border border-neutral-200 bg-white rounded-xl overflow-hidden shadow-xs transition-all duration-200"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleWeek(wGroup.key, isDefaultOpen)}
                                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50/80 transition-colors cursor-pointer text-left select-none"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-1.5 rounded-lg border transition-transform duration-200 ${isOpen ? "rotate-90 bg-blue-50 border-blue-100 text-blue-600" : "bg-neutral-50 border-neutral-200 text-neutral-400"}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-[#111827] truncate">
                                                    {wGroup.label}
                                                </h4>
                                                <p className="text-[11px] text-neutral-400 font-medium">
                                                    {wGroup.entries.length} logbook tercatat
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                            {wGroup.stats.hadir > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {wGroup.stats.hadir} Hadir
                                                </span>
                                            )}
                                            {wGroup.stats.sakitIzin > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    {wGroup.stats.sakitIzin} Sakit/Izin
                                                </span>
                                            )}
                                            {wGroup.stats.libur > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    {wGroup.stats.libur} Libur
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-neutral-100 bg-neutral-50/50 p-4 space-y-3 animate-in fade-in duration-150">
                                            {wGroup.entries.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="group border border-neutral-200/90 bg-white rounded-lg p-4 transition-all hover:border-neutral-300 hover:shadow-xs"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="space-y-1.5">
                                                            <h5 className="text-sm font-bold text-[#111827] tracking-tight">
                                                                {formatDate(entry.date)}
                                                            </h5>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span
                                                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                                        entry.status === "Hadir"
                                                                            ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
                                                                            : entry.status === "Sakit" || entry.status === "Izin"
                                                                            ? "bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]"
                                                                            : "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]"
                                                                    }`}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                                        entry.status === "Hadir"
                                                                            ? "bg-[#166534]"
                                                                            : entry.status === "Sakit" || entry.status === "Izin"
                                                                            ? "bg-[#92400E]"
                                                                            : "bg-[#991B1B]"
                                                                    }`} />
                                                                    {entry.status}
                                                                </span>

                                                                {entry.status === "Hadir" && (
                                                                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium bg-neutral-50 border border-neutral-100 rounded-md px-2 py-0.5">
                                                                        <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <span>{entry.timeIn.replace(":", ".")} - {entry.timeOut.replace(":", ".")}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => onEdit(entry)}
                                                                className="p-1.5 text-neutral-400 hover:text-[#1E3A8A] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => triggerDeleteConfirm(entry.id, entry.date)}
                                                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 bg-neutral-50/80 border border-neutral-100 rounded-md p-3 text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-wrap">
                                                        {entry.activity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent
                    className="w-[280px] max-w-[280px] bg-white border border-neutral-200 shadow-md rounded-xl p-5 text-center"
                    showCloseButton={false}
                >
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#111827]">Hapus logbook?</h4>
                            <p className="text-[11px] text-neutral-400 leading-normal">
                                Catatan tanggal <span className="font-semibold text-neutral-600">{targetEntry ? formatDate(targetEntry.date) : ""}</span> akan dihapus permanen.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmOpen(false)
                                    setTargetEntry(null)
                                }}
                                className="h-9 rounded-lg text-xs font-semibold text-neutral-400 hover:text-[#111827] transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={executeDelete}
                                className="h-9 rounded-lg text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

