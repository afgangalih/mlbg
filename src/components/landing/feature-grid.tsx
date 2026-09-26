"use client"

import { Sparkles, CalendarRange, Download } from "lucide-react"

export default function FeatureGrid() {
    return (
        <section id="features" className="bg-white py-20 md:py-32">
            <div className="mx-auto max-w-6xl px-6 space-y-16">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E40AF]">
                        Didesain untuk Kebutuhan Magang Anda
                    </h2>
                    <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                        Semua utilitas penting dikumpulkan dalam satu workspace minimalis. Fokus pada pekerjaan magang Anda, biar Logbooku yang mengurus administrasinya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#1E40AF]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-neutral-900 text-base">AI Paraphrase & Presets</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Dilengkapi preset template kegiatan untuk bimbingan mentor, diskusi kelompok, riset, atau penulisan dokumen untuk mempercepat proses pengisian.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                            <CalendarRange className="w-5 h-5 text-[#1E40AF]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-neutral-900 text-base">Smart Date & Weekend Skip</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Pengisian bertahap jadi lebih mudah. Sistem otomatis memperbarui tanggal ke hari berikutnya tanpa perlu Anda ganti manual, lengkap dengan auto-skip Sabtu & Minggu.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                            <Download className="w-5 h-5 text-[#1E40AF]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-neutral-900 text-base">Format Resmi Kampus</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Hasil ekspor file Word (.docx) dan PDF (.pdf) memiliki layout Kop Surat resmi Jurusan Sistem Informasi Bisnis Polinema dengan alignment dan proporsi kolom yang ideal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
