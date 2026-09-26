"use client"

import Link from "next/link"

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <img
                            src="/logbooku-logo.png"
                            alt="Logbooku Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-semibold text-neutral-600 hover:text-[#1E40AF] transition-colors">
                        Fitur Utama
                    </Link>
                    <Link href="#workflow" className="text-sm font-semibold text-neutral-600 hover:text-[#1E40AF] transition-colors">
                        Asisten AI
                    </Link>
                    <Link href="#preview" className="text-sm font-semibold text-neutral-600 hover:text-[#1E40AF] transition-colors">
                        Format Resmi
                    </Link>
                    <Link href="#comparison" className="text-sm font-semibold text-neutral-600 hover:text-[#1E40AF] transition-colors">
                        Komparasi
                    </Link>
                </nav>

                <div>
                    <Link href="/login" className="text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#1D4ED8] transition-all px-5 py-2 rounded-lg shadow-sm">
                        Masuk
                    </Link>
                </div>
            </div>
        </header>
    )
}
