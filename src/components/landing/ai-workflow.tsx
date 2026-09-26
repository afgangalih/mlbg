"use client"

import { useState } from "react"
import { Sparkles, CalendarDays, ArrowRightLeft, MessageSquare, GraduationCap, BookOpen, FileText } from "lucide-react"

type WorkflowTab = {
    title: string
    description: string
    icon: any
    bgColorClass: string
    borderColorClass: string
    textColorClass: string
    mockup: {
        title: string
        input: string
        output: string
        badge: string
    }
}

const TABS: WorkflowTab[] = [
    {
        title: "Smart Paraphraser",
        description: "Ubah draf kasar kegiatan harian Anda menjadi kalimat formal baku yang siap diserahkan ke jurusan.",
        icon: Sparkles,
        bgColorClass: "bg-blue-50/50",
        borderColorClass: "border-blue-100",
        textColorClass: "text-[#1E40AF]",
        mockup: {
            title: "Draf Kegiatan Harian",
            input: "diajari mentor cara deploy backend express ke vps",
            output: "Mengikuti sesi bimbingan bersama mentor lapangan mengenai tata cara deployment aplikasi backend Express.js ke Virtual Private Server (VPS).",
            badge: "AI Paraphraser Active"
        }
    },
    {
        title: "Continuation Engine",
        description: "Salin aktivitas hari kemarin secara instan dan AI akan memparafrase secara otomatis dengan gaya variasi penyelesaian.",
        icon: ArrowRightLeft,
        bgColorClass: "bg-[#edfcf5]",
        borderColorClass: "border-[#d1fae5]",
        textColorClass: "text-[#10b981]",
        mockup: {
            title: "Salin & Lanjutkan Kegiatan",
            input: "Melanjutkan pengerjaan codingan dari hari kemarin",
            output: "Melakukan finalisasi atas penulisan kode sumber (coding) antarmuka program serta melanjutkan perbaikan layout yang belum selesai.",
            badge: "Continuation Paraphrase"
        }
    },
    {
        title: "Auto-Advance Date",
        description: "Tanggal formulir otomatis maju 1 hari ke depan. Sistem otomatis melewati hari Sabtu dan Minggu untuk langsung ke Senin.",
        icon: CalendarDays,
        bgColorClass: "bg-[#fff8e5]",
        borderColorClass: "border-[#fef3c7]",
        textColorClass: "text-[#f59e0b]",
        mockup: {
            title: "Simulasi Penanggalan Otomatis",
            input: "Tanggal Tersimpan: Jumat, 17 Juli 2026",
            output: "Tanggal Baru Terisi: Senin, 20 Juli 2026 (Sabtu & Minggu dilewati otomatis)",
            badge: "Auto-Date Skip Weekend"
        }
    }
]

export default function AIWorkflow() {
    const [activeIdx, setActiveIdx] = useState(0)
    const current = TABS[activeIdx]
    const Icon = current.icon

    return (
        <section id="workflow" className="bg-white py-20 md:py-32 border-y border-neutral-200">
            <div className="mx-auto max-w-6xl px-6 space-y-16">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E40AF]">
                        Alur Kerja Cerdas & Interaktif
                    </h2>
                    <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                        Klik pada pilihan di sebelah kanan untuk melihat bagaimana AI dan sistem otomatisasi Logbooku mentransformasikan alur pengisian laporan Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        <div className={`flex-1 rounded-2xl border ${current.borderColorClass} ${current.bgColorClass} p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm transition-all duration-300`}>
                            <div className="flex items-center justify-between border-b border-neutral-200/55 pb-4">
                                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                                    <Icon className={`w-4 h-4 ${current.textColorClass}`} />
                                    {current.mockup.title}
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${current.textColorClass} bg-white border ${current.borderColorClass}`}>
                                    {current.mockup.badge}
                                </span>
                            </div>

                            <div className="space-y-4 flex-1 flex flex-col justify-center">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Input / Draf</span>
                                    <div className="p-3 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 font-mono leading-relaxed shadow-xs">
                                        "{current.mockup.input}"
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <span className={`text-[10px] font-bold ${current.textColorClass} uppercase tracking-wider block`}>Output Laporan</span>
                                    <div className="p-4 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-800 font-mono leading-relaxed font-medium shadow-xs">
                                        "{current.mockup.output}"
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] text-neutral-400 border-t border-neutral-200/55 pt-4">
                                Klik menu tab di samping untuk melihat variasi simulasi lainnya.
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
                        {TABS.map((tab, idx) => {
                            const TabIcon = tab.icon
                            const isActive = activeIdx === idx
                            return (
                                <button
                                    key={tab.title}
                                    type="button"
                                    onClick={() => setActiveIdx(idx)}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-4 items-start ${
                                        isActive
                                            ? `${tab.bgColorClass} ${tab.borderColorClass} shadow-sm`
                                            : "bg-white border-neutral-200 hover:border-neutral-300"
                                    }`}
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${
                                        isActive
                                            ? "bg-white " + tab.borderColorClass
                                            : "bg-neutral-50 border-neutral-200"
                                    }`}>
                                        <TabIcon className={`w-5 h-5 ${isActive ? tab.textColorClass : "text-neutral-500"}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={`font-bold text-sm ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                                            {tab.title}
                                        </h3>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            {tab.description}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
