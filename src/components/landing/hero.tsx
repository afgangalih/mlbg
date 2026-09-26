"use client"

import Link from "next/link"
import { Sparkles, FileDown, ArrowRight } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6 space-y-16">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                        Pencatatan logbook magang harian{" "}
                        <span className="relative inline-block text-[#1E40AF]">
                            otomatis dengan AI
                            <span className="absolute left-0 bottom-0.5 w-full h-1 bg-[#34D399] rounded"></span>
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Tulis coretan kasar aktivitas magang harian Anda, dan biarkan AI memparafrase secara formal sesuai standar akademik jurusan dalam hitungan detik.
                    </p>

                    <div className="flex flex-col items-center gap-2 pt-2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md">
                            <Link href="/register" className="h-12 px-8 rounded-lg font-bold text-white bg-[#1E40AF] hover:bg-[#1D4ED8] transition-all flex items-center justify-center shadow-md flex-1">
                                Coba Gratis Sekarang
                            </Link>
                        </div>
                        <span className="text-xs text-neutral-400 font-medium">Gratis selamanya • Tanpa kartu kredit</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-8 flex flex-col justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 leading-tight">
                                Tulis Kegiatan Harian<br />dengan AI
                            </h2>
                            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                                AI kami mengubah catatan kasar informal seperti pointer obrolan menjadi kalimat resmi operasional akademik.
                            </p>
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E40AF] hover:underline pt-2">
                                <span>Coba Asisten AI</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-sm font-mono text-[11px] leading-relaxed">
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Input Coretan</span>
                                <p className="bg-neutral-50 p-2.5 rounded border border-neutral-200/80 text-neutral-600">
                                    "bikin form login di web, nyoba integrasi supabase"
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-[#1E40AF] uppercase tracking-wider block flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-[#1E40AF]" /> Output Formal AI
                                </span>
                                <p className="bg-[#EFF6FF] p-2.5 rounded border border-[#DBEAFE] text-[#1E40AF] font-medium">
                                    "Melakukan perancangan formulir otentikasi (login) halaman web serta menguji integrasi database menggunakan Supabase."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl p-8 flex flex-col justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 leading-tight">
                                Ekspor Laporan Bulanan<br />Format Resmi
                            </h2>
                            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                                Laporan langsung tersusun rapi dengan Kop Surat Polinema, lebar kolom proporsional, dan tanda tangan simetris.
                            </p>
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#047857] hover:underline pt-2">
                                <span>Unduh Format Contoh</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-sm text-[10px] leading-normal font-sans">
                            <div className="border-b border-black pb-2 text-center flex items-center justify-between">
                                <span className="font-bold text-[8px] tracking-wide text-neutral-800">POLITEKNIK NEGERI MALANG</span>
                                <span className="font-mono text-[7px] text-neutral-400">Export Ready</span>
                            </div>
                            <table className="w-full border-collapse border border-neutral-300 text-[8px]">
                                <thead>
                                    <tr className="bg-neutral-50 text-center font-bold">
                                        <th className="border border-neutral-300 p-1 w-[25%]">Hari, Tanggal</th>
                                        <th className="border border-neutral-300 p-1 w-[10%]">Masuk</th>
                                        <th className="border border-neutral-300 p-1 w-[10%]">Pulang</th>
                                        <th className="border border-neutral-300 p-1 w-[55%] text-left">Kegiatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-neutral-300 p-1 text-center font-mono">Senin, 20 Jul 2026</td>
                                        <td className="border border-neutral-300 p-1 text-center font-mono">08.00</td>
                                        <td className="border border-neutral-300 p-1 text-center font-mono">17.00</td>
                                        <td className="border border-neutral-300 p-1 text-neutral-700">Melakukan perancangan formulir otentikasi halaman...</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="grid grid-cols-2 text-center text-[7px] pt-1">
                                <div>Dosen Pembimbing,</div>
                                <div>Pembimbing Lapangan,</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
