"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
            <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-800">Logbooku</span>
                    <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    <Link href="#features" className="hover:text-neutral-900 transition-colors">
                        Fitur
                    </Link>
                    <Link href="#workflow" className="hover:text-neutral-900 transition-colors">
                        Alur AI
                    </Link>
                    <Link href="#preview" className="hover:text-neutral-900 transition-colors">
                        Format
                    </Link>
                    <span className="px-2.5 py-1 rounded bg-neutral-200/60 text-neutral-700 text-xs font-semibold select-none">
                        Workflow Efisien Mahasiswa Magang
                    </span>
                </div>
            </div>
        </footer>
    )
}
