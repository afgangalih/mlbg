"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/shared/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userId, setUserId] = useState("")
    const [fullName, setFullName] = useState("")
    const [nim, setNim] = useState("")
    const [studyProgram, setStudyProgram] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [lecturerName, setLecturerName] = useState("")
    const [mentorName, setMentorName] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push("/login")
                return
            }
            setUserId(session.user.id)
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()
            if (profileData) {
                setFullName(profileData.full_name || "")
                setNim(profileData.nim || "")
                setStudyProgram(profileData.study_program || "")
                setCompanyName(profileData.company_name || "")
                setLecturerName(profileData.lecturer_name || "")
                setMentorName(profileData.mentor_name || "")
            }
            setLoading(false)
        }
        fetchProfile()
    }, [router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    nim,
                    study_program: studyProgram,
                    company_name: companyName,
                    lecturer_name: lecturerName,
                    mentor_name: mentorName,
                    updated_at: new Date().toISOString()
                })
                .eq("id", userId)
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Profil berhasil diperbarui")
            }
        } catch {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setSaving(false)
        }
    }

    const initials = fullName
        ? fullName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
        : "?"

    const inputClass = "h-10 border-neutral-200 bg-white text-[#111827] placeholder:text-neutral-300 focus-visible:border-neutral-400 focus-visible:ring-0 text-sm"
    const labelClass = "text-[10px] font-bold text-neutral-500 uppercase tracking-widest"

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center p-16">
                    <span className="text-sm text-neutral-400">Memuat profil...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] text-[#111827]">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Profil Pengguna</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Kelola identitas dan data akademik untuk keperluan logbook.
                    </p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-1 bg-white border border-neutral-200 rounded-xl p-6 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-[#1E3A8A] flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-white tracking-wider">{initials}</span>
                            </div>
                            <div className="text-center space-y-0.5">
                                <p className="text-base font-bold text-[#111827]">{fullName || "—"}</p>
                                <p className="text-sm text-neutral-500">{nim || "—"}</p>
                            </div>
                            {companyName && (
                                <div className="flex items-center gap-1.5 border border-neutral-200 rounded-full px-3 py-1.5 text-xs text-neutral-600 font-medium w-full justify-center">
                                    <svg className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">{companyName}</span>
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={saving}
                                className="h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white hover:bg-[#1E3A8A] hover:text-white active:bg-[#172554] disabled:opacity-60 transition-colors mt-2"
                            >
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>

                        <div className="md:col-span-2 space-y-5">
                            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                                    <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    <h2 className="text-sm font-bold text-[#111827]">Informasi Akademik</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="fullName" className={labelClass}>Nama Lengkap</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="nim" className={labelClass}>NIM</Label>
                                        <Input
                                            id="nim"
                                            type="text"
                                            value={nim}
                                            onChange={(e) => setNim(e.target.value)}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="studyProgram" className={labelClass}>Program Studi</Label>
                                    <Input
                                        id="studyProgram"
                                        type="text"
                                        value={studyProgram}
                                        onChange={(e) => setStudyProgram(e.target.value)}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="lecturerName" className={labelClass}>Dosen Pembimbing</Label>
                                    <Input
                                        id="lecturerName"
                                        type="text"
                                        value={lecturerName}
                                        onChange={(e) => setLecturerName(e.target.value)}
                                        placeholder="Wajib diisi untuk export dokumen"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                                    <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h2 className="text-sm font-bold text-[#111827]">Informasi Magang</h2>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="companyName" className={labelClass}>Nama Mitra Industri / Perusahaan</Label>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Wajib diisi untuk export dokumen"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="mentorName" className={labelClass}>Mentor Lapangan</Label>
                                    <Input
                                        id="mentorName"
                                        type="text"
                                        value={mentorName}
                                        onChange={(e) => setMentorName(e.target.value)}
                                        placeholder="Wajib diisi untuk export dokumen"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}
