"use client"

import Link from "next/link"

export default function CtaBanner() {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="relative bg-[#1E3A8A] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-lg">
                    <div className="space-y-4 max-w-2xl text-center md:text-left z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span>Pilih solusi yang</span>
                            <span className="bg-[#1E40AF] px-4 py-1 rounded-xl text-white inline-block">lebih efisien</span>
                        </h2>
                        <p className="text-sm md:text-base text-blue-50/90 leading-relaxed font-medium">
                            Catat, parafrase, skip weekend, dan ekspor logbook resmi Anda menggunakan perangkat apa pun.
                        </p>
                    </div>

                    <div className="relative flex items-center gap-6 z-10 flex-shrink-0">
                        <div className="hidden lg:block absolute -left-20 -top-12">
                            <svg className="w-16 h-16 text-[#60A5FA]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M10,10 C40,10 60,30 60,60" />
                                <path d="M50,55 L60,60 L65,50" />
                            </svg>
                        </div>
                        <Link href="/register" className="h-12 px-8 bg-white text-[#1E3A8A] hover:bg-blue-50 transition-all font-bold rounded-lg shadow-md flex items-center justify-center">
                            Mulai Gratis
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
