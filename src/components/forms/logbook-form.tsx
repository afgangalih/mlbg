"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Sparkles, RefreshCw, MessageSquare, GraduationCap, BookOpen, FileText, Loader2, ArrowLeft } from "lucide-react"

type LogbookEntry = {
    id: string
    date: string
    timeIn: string
    timeOut: string
    activity: string
    status: "Hadir" | "Sakit" | "Izin" | "Libur"
}

interface LogbookFormProps {
    onSubmit: (entry: Omit<LogbookEntry, "id"> & { id?: string }) => void
    editingEntry: LogbookEntry | null
    onCancelEdit: () => void
    lastActivity: string
    existingDates: string[]
}

const PARAPHRASE_PREFIXES = [
    "Melanjutkan pengembangan dari",
    "Melakukan finalisasi atas",
    "Melakukan evaluasi dan penyempurnaan dari",
    "Meneruskan implementasi dari",
    "Melakukan tinjauan lanjutan terhadap"
]

const PRESETS = [
    {
        label: "Diskusi Kelompok",
        iconName: "MessageSquare",
        template: "Melakukan diskusi kelompok/proyek bersama tim terkait perkembangan dan pembagian tugas pada proyek yang sedang dikerjakan."
    },
    {
        label: "Bimbingan Mentor",
        iconName: "GraduationCap",
        template: "Mengikuti sesi bimbingan dan konsultasi bersama mentor/dosen pembimbing terkait perkembangan kegiatan magang dan evaluasi hasil kerja."
    },
    {
        label: "Riset & Literatur",
        iconName: "BookOpen",
        template: "Melakukan riset mandiri dan studi literatur terkait modul/materi yang dibutuhkan dalam mendukung penyelesaian tugas di tempat magang."
    },
    {
        label: "Penyusunan Laporan",
        iconName: "FileText",
        template: "Melakukan penyusunan dan penulisan laporan/dokumen formal terkait progres dan hasil kegiatan magang sebagai bagian dari dokumentasi resmi."
    }
]

const advanceDateSkipWeekend = (dateStr: string): string => {
    const d = new Date(dateStr + "T00:00:00")
    d.setDate(d.getDate() + 1)
    while (d.getDay() === 0 || d.getDay() === 6) {
        d.setDate(d.getDate() + 1)
    }
    return d.toISOString().split("T")[0]
}

export default function LogbookForm({
    onSubmit,
    editingEntry,
    onCancelEdit,
    lastActivity,
    existingDates
}: LogbookFormProps) {
    const [date, setDate] = useState("")
    const [status, setStatus] = useState<"Hadir" | "Sakit" | "Izin" | "Libur">("Hadir")
    const [timeIn, setTimeIn] = useState("08:00")
    const [timeOut, setTimeOut] = useState("17:00")
    const [activity, setActivity] = useState("")
    const [isTimeInvalid, setIsTimeInvalid] = useState(false)
    const [isDateDuplicate, setIsDateDuplicate] = useState(false)

    const [isAIMode, setIsAIMode] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)

    useEffect(() => {
        if (editingEntry) {
            setDate(editingEntry.date)
            setStatus(editingEntry.status)
            setTimeIn(editingEntry.timeIn)
            setTimeOut(editingEntry.timeOut)
            setActivity(editingEntry.activity)
        } else {
            const today = new Date().toISOString().split("T")[0]
            setDate(today)
            setStatus("Hadir")
            setTimeIn("08:00")
            setTimeOut("17:00")
            setActivity("")
        }
        setIsAIMode(false)
    }, [editingEntry])

    useEffect(() => {
        if (status !== "Hadir") {
            setIsTimeInvalid(false)
            return
        }
        if (timeIn && timeOut) {
            const [inHours, inMins] = timeIn.split(":").map(Number)
            const [outHours, outMins] = timeOut.split(":").map(Number)
            const inTotal = inHours * 60 + inMins
            const outTotal = outHours * 60 + outMins
            setIsTimeInvalid(outTotal <= inTotal)
        } else {
            setIsTimeInvalid(false)
        }
    }, [timeIn, timeOut, status])

    useEffect(() => {
        if (!date) {
            setIsDateDuplicate(false)
            return
        }
        if (editingEntry && date === editingEntry.date) {
            setIsDateDuplicate(false)
            return
        }
        setIsDateDuplicate(existingDates.includes(date))
    }, [date, editingEntry, existingDates])

    const handleStatusChange = (newStatus: "Hadir" | "Sakit" | "Izin" | "Libur") => {
        setStatus(newStatus)
        if (newStatus !== "Hadir") {
            setTimeIn("-")
            setTimeOut("-")
            setActivity(newStatus)
        } else {
            setTimeIn("08:00")
            setTimeOut("17:00")
            setActivity("")
        }
        setIsAIMode(false)
    }

    const handleInsertPreset = (template: string) => {
        setActivity(template)
    }

    const handleParaphraseLast = () => {
        if (!lastActivity) return
        const prefix = PARAPHRASE_PREFIXES[Math.floor(Math.random() * PARAPHRASE_PREFIXES.length)]
        const lastFirstLine = lastActivity.split("\n")[0].toLowerCase().replace(/^(melanjutkan|melakukan|mengikuti|meneruskan)\s+/i, "")
        setActivity(`${prefix} ${lastFirstLine}.`)
    }

    const handleGenerateAI = async () => {
        if (activity.trim().length === 0) {
            toast.error("Tulis draf kegiatan terlebih dahulu")
            return
        }
        setAiLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token || ""

            const response = await fetch("/api/ai/paraphrase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ draft: activity })
            })

            const data = await response.json()
            if (!response.ok) {
                toast.error(data.error || "Gagal memproses draf kegiatan")
                return
            }
            setActivity(data.result)
            setIsAIMode(false)
            toast.success("Kalimat formal AI berhasil diterapkan")
        } catch {
            toast.error("Terjadi kesalahan koneksi")
        } finally {
            setAiLoading(false)
        }
    }

    const renderPresetIcon = (name: string) => {
        switch (name) {
            case "MessageSquare": return <MessageSquare className="w-3 h-3" />
            case "GraduationCap": return <GraduationCap className="w-3 h-3" />
            case "BookOpen": return <BookOpen className="w-3 h-3" />
            case "FileText": return <FileText className="w-3 h-3" />
            default: return null
        }
    }

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault()
        if (isTimeInvalid && status === "Hadir") return
        onSubmit({
            id: editingEntry?.id,
            date,
            timeIn,
            timeOut,
            activity,
            status
        })
        if (!editingEntry) {
            setActivity("")
            setDate(advanceDateSkipWeekend(date))
        }
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
                <h3 className="text-base font-semibold text-[#111827]">
                    {editingEntry ? "Perbarui Logbook" : "Isi Kegiatan Harian"}
                </h3>
                {editingEntry && (
                    <button
                        onClick={onCancelEdit}
                        className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Batal Edit
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-[#111827]">
                        Tanggal Kegiatan
                    </Label>
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="h-10 text-sm border-neutral-200 bg-white focus-visible:border-neutral-400 focus-visible:ring-0"
                    />
                    {isDateDuplicate && (
                        <p className="text-xs text-red-500 font-medium">
                            Tanggal ini sudah memiliki entri logbook. Gunakan tombol edit pada list kegiatan untuk mengubahnya.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-[#111827]">
                        Status Kehadiran
                    </Label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as any)}
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-neutral-400"
                    >
                        <option value="Hadir">Hadir</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Izin">Izin</option>
                        <option value="Libur">Libur</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="timeIn" className="text-sm font-medium text-[#111827]">
                            Jam Masuk
                        </Label>
                        <Input
                            id="timeIn"
                            type={status === "Hadir" ? "time" : "text"}
                            value={timeIn}
                            onChange={(e) => setTimeIn(e.target.value)}
                            disabled={status !== "Hadir"}
                            required
                            className="h-10 text-sm border-neutral-200 bg-white focus-visible:border-neutral-400 focus-visible:ring-0 disabled:bg-neutral-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timeOut" className="text-sm font-medium text-[#111827]">
                            Jam Pulang
                        </Label>
                        <Input
                            id="timeOut"
                            type={status === "Hadir" ? "time" : "text"}
                            value={timeOut}
                            onChange={(e) => setTimeOut(e.target.value)}
                            disabled={status !== "Hadir"}
                            required
                            className="h-10 text-sm border-neutral-200 bg-white focus-visible:border-neutral-400 focus-visible:ring-0 disabled:bg-neutral-50"
                        />
                    </div>
                </div>

                {isTimeInvalid && (
                    <p className="text-xs text-red-500 font-medium">
                        Jam pulang harus lebih akhir dari jam masuk.
                    </p>
                )}

                {status === "Hadir" && !isAIMode && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                                Template Cepat
                            </Label>
                            {lastActivity && (
                                <button
                                    type="button"
                                    onClick={handleParaphraseLast}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3A8A] hover:text-[#172554] transition-colors"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Parafrase Kemarin</span>
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => handleInsertPreset(preset.template)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600 hover:bg-[#1E3A8A] hover:text-white border border-transparent hover:border-[#1E3A8A] transition-all"
                                >
                                    {renderPresetIcon(preset.iconName)}
                                    <span>{preset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="activity" className="text-sm font-medium text-[#111827]">
                            {isAIMode ? "Draf Coretan Kasar (AI)" : "Detail Kegiatan"}
                        </Label>
                        {status === "Hadir" && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAIMode(!isAIMode)
                                    if (!isAIMode) {
                                        setActivity("")
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white text-[#111827] border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer"
                            >
                                {isAIMode ? (
                                    <>
                                        <ArrowLeft className="w-3 h-3 text-neutral-500" />
                                        <span>Kembali</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3 h-3 text-neutral-500" />
                                        <span>Tulis dengan AI</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <textarea
                        id="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        placeholder={
                            isAIMode 
                                ? "Tulis coretan kasar kegiatan Anda di sini (contoh: benerin bug, meeting tim)" 
                                : status === "Hadir" 
                                    ? "Deskripsikan apa yang Anda kerjakan hari ini..." 
                                    : `Sedang ${status}`
                        }
                        required
                        disabled={status !== "Hadir"}
                        rows={4}
                        className="w-full text-sm p-3 rounded-lg border border-neutral-200 bg-white text-[#111827] placeholder:text-neutral-400 outline-none focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />

                    {isAIMode && (
                        <button
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={aiLoading || activity.trim().length === 0}
                            className="w-full h-9 mt-1 rounded-md bg-[#111827] text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            {aiLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-3.5 w-3.5 text-white" />
                                    <span>Memproses Kalimat Formal...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                    <span>Parafrase dengan AI</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={(isTimeInvalid && status === "Hadir") || !activity || isDateDuplicate || isAIMode}
                    className="h-10 w-full rounded-lg bg-[#111827] text-sm font-medium text-white hover:bg-[#1E3A8A] hover:text-white active:bg-[#172554] disabled:opacity-60 transition-all"
                >
                    {editingEntry ? "Perbarui Logbook" : "Simpan Logbook"}
                </Button>
            </form>
        </div>
    )
}
