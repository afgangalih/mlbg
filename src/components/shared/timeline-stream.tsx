"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"

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
        <div className="space-y-4">
            {entries.map((entry) => (
                <div
                    key={entry.id}
                    className="group border border-neutral-200 bg-white rounded-xl p-5 transition-colors hover:border-neutral-300"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-[#111827] tracking-tight">
                                {formatDate(entry.date)}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
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
                                    <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium bg-neutral-50 border border-neutral-100 rounded-md px-2 py-1">
                                        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Pukul {entry.timeIn.replace(":", ".")} - {entry.timeOut.replace(":", ".")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => onEdit(entry)}
                                className="p-2 text-neutral-400 hover:text-[#1E3A8A] hover:bg-neutral-50 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => triggerDeleteConfirm(entry.id, entry.date)}
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-3.5 bg-neutral-50 border border-neutral-100/80 rounded-lg p-3 text-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-wrap">
                        {entry.activity}
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
