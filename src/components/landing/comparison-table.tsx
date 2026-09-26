"use client"

import { Check, X } from "lucide-react"

export default function ComparisonTable() {
    return (
        <section id="comparison" className="bg-white py-20 md:py-32">
            <div className="mx-auto max-w-6xl px-6 space-y-16">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E40AF]">
                        Bandingkan Efisiensi Kerja Anda
                    </h2>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                        Kenapa membuang waktu 1-2 jam setiap akhir pekan hanya untuk menyusun berkas administratif magang secara manual?
                    </p>
                </div>

                <div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-sm">
                    <table className="w-full text-left border-collapse bg-white text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50/50">
                                <th className="p-4 md:p-6 font-semibold text-neutral-900 w-1/2">Kemampuan / Fitur</th>
                                <th className="p-4 md:p-6 font-semibold text-neutral-500 text-center w-1/4">Manual (Word/Excel)</th>
                                <th className="p-4 md:p-6 font-semibold text-[#1E40AF] text-center w-1/4">Logbooku Workspace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 font-medium">
                            <tr>
                                <td className="p-4 md:p-6 text-neutral-800">Penyusunan Format Kop Surat Kampus</td>
                                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-4 md:p-6 text-neutral-800">Parafrase Formal Kalimat Kasar (AI)</td>
                                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-4 md:p-6 text-neutral-800">Skip Hari Sabtu & Minggu Otomatis</td>
                                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-4 md:p-6 text-neutral-800">Auto-increment Tanggal Kegiatan</td>
                                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-4 md:p-6 text-neutral-800">Ekspor Langsung ke File .docx & .pdf</td>
                                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
