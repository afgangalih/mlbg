"use client"

export default function DocPreview() {
    return (
        <section id="preview" className="bg-neutral-50 py-20 md:py-32 border-y border-neutral-200">
            <div className="mx-auto max-w-6xl px-6 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E40AF]">
                        Hasil Ekspor Dokumen Resmi
                    </h2>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                        Simulasi dokumen cetak A4 yang dihasilkan. Layout presisi berstandar akademik bebas dari masalah alignment atau teks buram.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-3xl bg-white border border-neutral-300 shadow-2xl p-8 md:p-12 text-[#000000] font-serif text-[10px] md:text-xs leading-normal select-none">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-6">
                            <div className="w-16 h-16 border border-neutral-300 bg-neutral-100 flex items-center justify-center font-sans text-[9px] text-neutral-400 font-bold uppercase rounded">
                                Logo
                            </div>
                            <div className="text-center flex-1 space-y-0.5">
                                <p className="font-bold text-[9px] tracking-wide">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</p>
                                <p className="font-bold text-sm tracking-wide">POLITEKNIK NEGERI MALANG</p>
                                <p className="font-bold text-[9px] tracking-wide">JURUSAN SISTEM INFORMASI BISNIS</p>
                                <p className="text-[8px] font-sans text-neutral-600">Jalan Soekarno Hatta Nomor 9, Malang 65141 // Laman www.polinema.ac.id</p>
                            </div>
                        </div>

                        <div className="text-center font-bold text-xs space-y-0.5 mb-6 uppercase tracking-wide">
                            <p>LOG BOOK KEGIATAN</p>
                            <p>PROGRAM MAGANG INDUSTRI</p>
                        </div>

                        <table className="w-full mb-6 font-sans text-[9px] text-left">
                            <tbody>
                                <tr>
                                    <td className="w-32 py-1 font-bold">Nama Mahasiswa</td>
                                    <td className="py-1">: Afgan Galih Fauz Amjad Amadinah</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-bold">NIM</td>
                                    <td className="py-1">: 2341760004</td>
                                </tr>
                                <tr>
                                    <td className="py-1 font-bold">Program Studi</td>
                                    <td className="py-1">: D4 Sistem Informasi Bisnis</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border-collapse border border-black font-sans text-[8px] mb-8">
                            <thead>
                                <tr className="bg-neutral-50 text-center font-bold">
                                    <th className="border border-black p-2 w-[25%]">Hari, Tanggal</th>
                                    <th className="border border-black p-2 w-[10%]">Jam Masuk</th>
                                    <th className="border border-black p-2 w-[10%]">Jam Pulang</th>
                                    <th className="border border-black p-2 w-[55%] text-left">Kegiatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-2 text-center">Senin, 20 Jul 2026</td>
                                    <td className="border border-black p-2 text-center">08.00</td>
                                    <td className="border border-black p-2 text-center">17.00</td>
                                    <td className="border border-black p-2">Melakukan perbaikan bug pada antarmuka layout footer serta mengikuti sesi bimbingan bersama mentor terkait integrasi dokumen PDF.</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2 text-center">Selasa, 21 Jul 2026</td>
                                    <td className="border border-black p-2 text-center">08.00</td>
                                    <td className="border border-black p-2 text-center">17.00</td>
                                    <td className="border border-black p-2">Melanjutkan pengembangan modul ekspor laporan bulanan serta menyusun dokumen teknis laporan akhir magang.</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="grid grid-cols-2 gap-12 pt-4 text-center font-sans text-[9px]">
                            <div className="space-y-12">
                                <p>Dosen Pembimbing,</p>
                                <div>
                                    <p className="font-bold underline">Rendra Suprobo, S.Kom., M.T.</p>
                                    <p className="text-neutral-500">NIP. 198901232015041002</p>
                                </div>
                            </div>
                            <div className="space-y-12">
                                <p>Pembimbing Lapangan,</p>
                                <div>
                                    <p className="font-bold underline">Hendra Wijaya</p>
                                    <p className="text-neutral-500">VP Engineering</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
