"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Nama lengkap minimal 2 karakter" }),
    nim: z.string().min(3, { message: "NIM minimal 3 karakter" }),
    studyProgram: z.string().min(2, { message: "Program studi minimal 2 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            nim: "",
            studyProgram: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: RegisterValues) => {
        setLoading(true)
        setErrorMsg("")
        try {
            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
            })
            if (error) {
                setErrorMsg(error.message)
                return
            }
            if (data?.user) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: data.user.id,
                        nim: values.nim,
                        full_name: values.fullName,
                        study_program: values.studyProgram,
                    })
                if (profileError) {
                    setErrorMsg(profileError.message)
                    return
                }
                router.push("/dashboard")
                router.refresh()
            }
        } catch {
            setErrorMsg("Terjadi kesalahan sistem")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "h-10 border-neutral-200 bg-white text-[#111827] placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-0"

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
                    Buat akun logbook
                </h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Lengkapi data diri untuk mulai mencatat kegiatan magang
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-sm font-medium text-[#111827]">
                            Nama Lengkap
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Nama sesuai KTP"
                            className={inputClass}
                            {...register("fullName")}
                        />
                        {errors.fullName && (
                            <p className="text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="nim" className="text-sm font-medium text-[#111827]">
                                NIM
                            </Label>
                            <Input
                                id="nim"
                                type="text"
                                placeholder="Nomor Induk"
                                className={inputClass}
                                {...register("nim")}
                            />
                            {errors.nim && (
                                <p className="text-xs text-red-500">{errors.nim.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="studyProgram" className="text-sm font-medium text-[#111827]">
                                Program Studi
                            </Label>
                            <Input
                                id="studyProgram"
                                type="text"
                                placeholder="Teknik Informatika"
                                className={inputClass}
                                {...register("studyProgram")}
                            />
                            {errors.studyProgram && (
                                <p className="text-xs text-red-500">{errors.studyProgram.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-[#111827]">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            className={inputClass}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-[#111827]">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={inputClass}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-500">{errorMsg}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="mt-1 h-10 w-full rounded-lg bg-[#111827] text-sm font-medium text-white hover:bg-[#1f2937] active:bg-[#0f172a] disabled:opacity-60"
                    >
                        {loading ? "Mendaftarkan..." : "Buat Akun"}
                    </Button>
                </form>
            </div>

            <p className="mt-5 text-center text-sm text-neutral-500">
                Sudah punya akun?{" "}
                <Link
                    href="/login"
                    className="font-medium text-[#111827] underline-offset-4 hover:underline"
                >
                    Masuk
                </Link>
            </p>
        </div>
    )
}
