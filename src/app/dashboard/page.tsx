"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/shared/navbar"
import WarningBanner from "@/components/shared/warning-banner"
import FilterBar from "@/components/shared/filter-bar"
import LogbookForm from "@/components/forms/logbook-form"
import TimelineStream from "@/components/shared/timeline-stream"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { getWeeksOfMonth } from "@/lib/utils"

type LogbookEntry = {
    id: string
    date: string
    timeIn: string
    timeOut: string
    activity: string
    status: "Hadir" | "Sakit" | "Izin" | "Libur"
}

const formatDateDay = (dateStr: string) => {
    try {
        const date = new Date(dateStr + "T00:00:00")
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    } catch {
        return dateStr
    }
}

const formatTime = (time: string) => {
    if (!time || time === "-") return "-"
    return time.replace(":", ".")
}

const sortLogbookEntries = (list: LogbookEntry[]): LogbookEntry[] => {
    if (!Array.isArray(list)) return []
    return [...list].sort((a, b) => {
        const dateA = a.date || ""
        const dateB = b.date || ""
        const dateCompare = dateB.localeCompare(dateA)
        if (dateCompare !== 0) return dateCompare
        const timeA = a.timeIn && a.timeIn !== "-" ? a.timeIn : ""
        const timeB = b.timeIn && b.timeIn !== "-" ? b.timeIn : ""
        return timeB.localeCompare(timeA)
    })
}

export default function DashboardPage() {
    const router = useRouter()
    const [previewOpen, setPreviewOpen] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [entries, setEntries] = useState<LogbookEntry[]>([])
    const [editingEntry, setEditingEntry] = useState<LogbookEntry | null>(null)
    const [selectedMonth, setSelectedMonth] = useState("all")
    const [selectedWeek, setSelectedWeek] = useState("all")
    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push("/login")
                return
            }

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
                const isProfileIncomplete = !profileData.lecturer_name || !profileData.mentor_name || !profileData.company_name
                setShowWarning(isProfileIncomplete)
            }

            const { data: logbooksData, error: logbooksError } = await supabase
                .from("logbooks")
                .select("*")
                .eq("user_id", session.user.id)
                .order("date", { ascending: false })

            if (logbooksError) {
                console.error("Error fetching logbooks:", logbooksError)
            }

            if (logbooksData) {
                const mapped = logbooksData.map((item: any) => ({
                    id: item.id,
                    date: item.date,
                    timeIn: item.time_in ? item.time_in.substring(0, 5) : "-",
                    timeOut: item.time_out ? item.time_out.substring(0, 5) : "-",
                    activity: item.activity,
                    status: item.status_kehadiran
                }))
                setEntries(sortLogbookEntries(mapped))
            }
        }
        checkAuth()
    }, [router])

    const handleFormSubmit = async (entryData: Omit<LogbookEntry, "id"> & { id?: string }) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        if (entryData.id) {
            const { error } = await supabase
                .from("logbooks")
                .update({
                    date: entryData.date,
                    time_in: entryData.timeIn === "-" ? null : entryData.timeIn,
                    time_out: entryData.timeOut === "-" ? null : entryData.timeOut,
                    activity: entryData.activity,
                    status_kehadiran: entryData.status
                })
                .eq("id", entryData.id)

            if (error) {
                toast.error(error.message)
                return
            }

            setEntries(prev =>
                sortLogbookEntries(
                    prev.map(item =>
                        item.id === entryData.id ? { ...item, ...entryData } : item
                    )
                )
            )
            setEditingEntry(null)
            toast.success("Logbook berhasil diperbarui")
        } else {
            const { data, error } = await supabase
                .from("logbooks")
                .insert({
                    user_id: session.user.id,
                    date: entryData.date,
                    time_in: entryData.timeIn === "-" ? null : entryData.timeIn,
                    time_out: entryData.timeOut === "-" ? null : entryData.timeOut,
                    activity: entryData.activity,
                    status_kehadiran: entryData.status
                })
                .select()
                .single()

            if (error) {
                toast.error(error.message)
                return
            }

            const newEntry: LogbookEntry = {
                id: data.id,
                date: data.date,
                timeIn: data.time_in ? data.time_in.substring(0, 5) : "-",
                timeOut: data.time_out ? data.time_out.substring(0, 5) : "-",
                activity: data.activity,
                status: data.status_kehadiran
            }
            setEntries(prev => sortLogbookEntries([newEntry, ...prev]))
            toast.success("Logbook berhasil ditambahkan")
        }
    }

    const handleEdit = (entry: LogbookEntry) => setEditingEntry(entry)

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("logbooks")
            .delete()
            .eq("id", id)

        if (error) {
            toast.error(error.message)
            return
        }

        setEntries(prev => prev.filter(item => item.id !== id))
        if (editingEntry?.id === id) setEditingEntry(null)
        toast.success("Logbook berhasil dihapus")
    }

    let filterYear = new Date().getFullYear()
    if (selectedMonth !== "all" && entries.length > 0) {
        const found = entries.find(e => e.date.split("-")[1] === selectedMonth)
        if (found) {
            filterYear = parseInt(found.date.split("-")[0], 10)
        }
    }
    const weeks = selectedMonth !== "all" ? getWeeksOfMonth(filterYear, parseInt(selectedMonth, 10)) : []

    const generateFilename = (extension: string) => {
        const nim = profile?.nim ? String(profile.nim).replace(/[^a-zA-Z0-9]/g, "") : "Magang"
        const fullName = profile?.full_name 
            ? String(profile.full_name)
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9_]/g, "")
            : "Mahasiswa"

        let period = "Semua_Periode"

        if (selectedDate) {
            const parts = selectedDate.split("-")
            if (parts.length === 3) {
                const day = parseInt(parts[2], 10)
                const monthNum = parts[1]
                const year = parts[0]
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                const monthIndex = parseInt(monthNum, 10) - 1
                const monthName = months[monthIndex] || "Bulan"
                period = `${day}_${monthName}_${year}`
            }
        } else if (selectedMonth && selectedMonth !== "all") {
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
            const monthIndex = parseInt(selectedMonth, 10) - 1
            const monthName = months[monthIndex] || "Bulan"
            
            let year = new Date().getFullYear().toString()
            const found = entries.find(e => e.date.split("-")[1] === selectedMonth)
            if (found) {
                year = found.date.split("-")[0]
            }

            if (selectedWeek !== "all" && weeks.length > 0) {
                const activeW = weeks.find(w => w.weekNumber.toString() === selectedWeek)
                if (activeW) {
                    const startDay = parseInt(activeW.startDate.split("-")[2], 10)
                    const endDay = parseInt(activeW.endDate.split("-")[2], 10)
                    period = `${monthName} ${year} (W${selectedWeek}, ${startDay} - ${endDay})`
                } else {
                    period = `${monthName} ${year} W${selectedWeek}`
                }
            } else {
                period = `${monthName} ${year}`
            }
        }

        const cleanFilename = `Logbook_${period}.${extension}`
        return cleanFilename.replace(/[\/\\:\*\?"<>\|]/g, "")
    }

    const handleExportWord = async () => {
        try {
            const { generateLogbookDocx } = await import("@/lib/exportDocx")
            const sortedForExport = [...filteredEntries].sort((a, b) => a.date.localeCompare(b.date))
            const blob = await generateLogbookDocx(profile, sortedForExport)
            const url = window.URL.createObjectURL(blob)
            const filename = generateFilename("docx")
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success("Dokumen Word (.docx) berhasil diunduh")
        } catch {
            toast.error("Gagal mengekspor dokumen Word")
        }
    }

    const handleExportPDF = async () => {
        try {
            const { generateLogbookPdf } = await import("@/lib/exportPdf")
            const sortedForExport = [...filteredEntries].sort((a, b) => a.date.localeCompare(b.date))
            const filename = generateFilename("pdf")
            await generateLogbookPdf(profile, sortedForExport, filename)
            toast.success("Dokumen PDF (.pdf) berhasil diunduh")
        } catch {
            toast.error("Gagal mengekspor dokumen PDF")
        }
    }

    const handleExportSeparate = async (type: "pdf" | "docx") => {
        try {
            const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date))
            
            for (const w of weeks) {
                const weekEntries = sortedEntries.filter(entry => {
                    const entryMonth = entry.date.split("-")[1]
                    if (entryMonth !== selectedMonth) return false
                    return entry.date >= w.startDate && entry.date <= w.endDate
                })
                
                if (weekEntries.length === 0) continue
                
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                const monthIndex = parseInt(selectedMonth, 10) - 1
                const monthName = months[monthIndex] || "Bulan"
                
                let year = new Date().getFullYear().toString()
                const found = entries.find(e => e.date.split("-")[1] === selectedMonth)
                if (found) {
                    year = found.date.split("-")[0]
                }

                const startDay = parseInt(w.startDate.split("-")[2], 10)
                const endDay = parseInt(w.endDate.split("-")[2], 10)
                
                const filename = `Logbook_${monthName} ${year} (W${w.weekNumber}, ${startDay} - ${endDay}).${type}`.replace(/[\/\\:\*\?"<>\|]/g, "")
                
                if (type === "docx") {
                    const { generateLogbookDocx } = await import("@/lib/exportDocx")
                    const blob = await generateLogbookDocx(profile, weekEntries)
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                } else {
                    const { generateLogbookPdf } = await import("@/lib/exportPdf")
                    await generateLogbookPdf(profile, weekEntries, filename)
                }
                
                await new Promise(resolve => setTimeout(resolve, 300))
            }
            toast.success(`Berhasil mengekspor seluruh minggu terpisah (.${type})`)
        } catch {
            toast.error(`Gagal mengekspor laporan terpisah`)
        }
    }

    const filteredEntries = entries.filter((entry) => {
        if (selectedDate && entry.date !== selectedDate) return false
        if (selectedMonth !== "all") {
            const entryMonth = entry.date.split("-")[1]
            if (entryMonth !== selectedMonth) return false
            
            if (selectedWeek !== "all" && weeks.length > 0) {
                const activeWeek = weeks.find(w => w.weekNumber.toString() === selectedWeek)
                if (activeWeek) {
                    if (entry.date < activeWeek.startDate || entry.date > activeWeek.endDate) {
                        return false
                    }
                }
            }
        }
        return true
    })

    const lastActivity = entries.length > 0 ? entries[0].activity : ""

    return (
        <div className="min-h-screen bg-white text-[#111827]">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
                <WarningBanner isVisible={showWarning} />

                <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                                Ekspor Laporan Resmi
                            </h3>
                            <p className="text-[11px] text-neutral-500">
                                Unduh berkas logbook sesuai format standar resmi kampus.
                            </p>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(true)}
                                className="h-9 px-4 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-[#111827] hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                Preview Cetak
                            </button>
                        </div>
                    </div>

                    <div className={`grid gap-6 ${selectedMonth !== "all" && selectedWeek === "all" && weeks.length > 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Format Gabungan (Bulanan)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleExportPDF}
                                    className="h-10 text-xs font-semibold rounded-lg bg-[#1E40AF] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                                >
                                    Unduh PDF (.pdf)
                                </button>
                                <button
                                    type="button"
                                    onClick={handleExportWord}
                                    className="h-10 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-[#111827] hover:bg-neutral-50 transition-colors cursor-pointer"
                                >
                                    Unduh Word (.docx)
                                </button>
                            </div>
                        </div>

                        {selectedMonth !== "all" && selectedWeek === "all" && weeks.length > 0 && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Format Terpisah (Mingguan)</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleExportSeparate("pdf")}
                                        className="h-10 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                                    >
                                        Multi PDF (.pdf)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExportSeparate("docx")}
                                        className="h-10 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                                    >
                                        Multi Word (.docx)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                    <div className="md:col-span-3 space-y-6">
                        <FilterBar
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedWeek={selectedWeek}
                            setSelectedWeek={setSelectedWeek}
                            weeks={weeks}
                        />
                        <TimelineStream
                            entries={filteredEntries}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                    <div className="md:col-span-2 md:sticky md:top-20">
                        <LogbookForm
                            onSubmit={handleFormSubmit}
                            editingEntry={editingEntry}
                            onCancelEdit={() => setEditingEntry(null)}
                            lastActivity={lastActivity}
                            existingDates={entries.map(e => e.date)}
                        />
                    </div>
                </div>
            </main>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent
                    className="max-w-4xl w-[90vw] h-[90vh] max-h-[90vh] sm:max-w-4xl overflow-y-auto bg-white p-10 text-black border border-neutral-200 shadow-none rounded-xl"
                    showCloseButton={true}
                >
                    <DialogHeader className="border-b border-neutral-200 pb-4 mb-6">
                        <DialogTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Pratinjau Laporan Resmi — Format Kampus Politeknik Negeri Malang
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 text-black font-serif px-2">
                        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                            <img src="/polinema-gray.jpg" alt="Logo Polinema" className="w-24 h-24 object-contain" />
                            <div className="text-center flex-1 pr-24">
                                <p className="text-xs text-black leading-snug">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</p>
                                <p className="text-sm font-bold text-black leading-snug uppercase">POLITEKNIK NEGERI MALANG</p>
                                <p className="text-xs font-semibold text-black leading-snug uppercase">
                                    {profile?.study_program
                                        ? `JURUSAN ${profile.study_program.toUpperCase()}`
                                        : "JURUSAN TEKNOLOGI INFORMASI"}
                                </p>
                                <p className="text-[10px] text-black leading-snug">Jalan Soekarno Hatta Nomor 9, Jatimulyo, Lowokwaru, Malang 65141</p>
                                <p className="text-[10px] text-black leading-snug">Telepon (0341) 404424, 404425; Faksimile (0341) 404420</p>
                                <p className="text-[10px] text-black leading-snug">Laman www.polinema.ac.id</p>
                            </div>
                        </div>

                        <div className="text-center space-y-0.5 mb-4">
                            <p className="text-sm font-bold uppercase tracking-wide">LOG BOOK KEGIATAN</p>
                            <p className="text-sm font-bold uppercase tracking-wide">PROGRAM MAGANG INDUSTRI</p>
                        </div>

                        <table className="w-full text-sm border-collapse mb-4">
                            <tbody>
                                <tr>
                                    <td className="py-1 w-44 font-semibold text-black">Nama</td>
                                    <td className="py-1 w-4">:</td>
                                    <td className="py-1 text-black">{profile?.full_name || ".................................................."}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-semibold text-black">NIM</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1 text-black">{profile?.nim || ".................................................."}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-semibold text-black">Program Studi</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1 text-black">{profile?.study_program || ".................................................."}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-semibold text-black">Nama Mitra Industri</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1 text-black">{profile?.company_name || ".................................................."}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border-collapse border border-black text-xs my-4">
                            <thead>
                                <tr className="bg-neutral-50">
                                    <th className="border border-black px-3 py-2 text-center font-semibold w-[25%]">Hari, Tanggal</th>
                                    <th className="border border-black px-2 py-2 text-center font-semibold w-[10%]">Jam Masuk</th>
                                    <th className="border border-black px-2 py-2 text-center font-semibold w-[10%]">Jam Pulang</th>
                                    <th className="border border-black px-3 py-2 text-left font-semibold w-[55%]">Kegiatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="border border-black px-3 py-8 text-center text-neutral-400">
                                            Belum ada kegiatan tercatat untuk filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    [...filteredEntries].sort((a, b) => a.date.localeCompare(b.date)).map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="border border-black px-3 py-2 text-center align-top font-medium">{formatDateDay(entry.date)}</td>
                                            <td className="border border-black px-2 py-2 text-center align-top">{entry.status === "Hadir" ? formatTime(entry.timeIn) : "-"}</td>
                                            <td className="border border-black px-2 py-2 text-center align-top">{entry.status === "Hadir" ? formatTime(entry.timeOut) : "-"}</td>
                                            <td className="border border-black px-3 py-2 align-top whitespace-pre-wrap">{entry.activity}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="pt-6">
                            <div className="flex justify-end pr-12 mb-6">
                                <div className="text-center text-xs">
                                    <p className="text-black">Mahasiswa,</p>
                                    <div className="h-16"></div>
                                    <p className="font-semibold text-black">{profile?.full_name || "..................................."}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed border-neutral-200">
                                <p className="text-xs text-center text-black font-semibold mb-4">Mengetahui,</p>
                                <div className="flex justify-between items-start text-center text-xs px-12 mt-12">
                                    <div className="w-64">
                                        <p className="text-black">Dosen Pembimbing,</p>
                                        <div className="h-20"></div>
                                        <p className="text-black">{"................................................"}</p>
                                        <p className="font-semibold text-black mt-1">{profile?.lecturer_name || ""}</p>
                                    </div>
                                    <div className="w-64">
                                        <p className="text-black">Pembimbing Lapangan,</p>
                                        <div className="h-20"></div>
                                        <p className="text-black">{"................................................"}</p>
                                        <p className="font-semibold text-black mt-1">{profile?.mentor_name || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

