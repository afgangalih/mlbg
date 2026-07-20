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

const loginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    const onSubmit = async (values: LoginValues) => {
        setLoading(true)
        setErrorMsg("")
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            })
            if (error) {
                setErrorMsg(error.message)
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch {
            setErrorMsg("Terjadi kesalahan sistem")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
                    Selamat datang kembali
                </h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Masuk untuk melanjutkan logbook harian Anda
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-[#111827]">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            className="h-10 border-neutral-200 bg-white text-[#111827] placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-0"
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
                            className="h-10 border-neutral-200 bg-white text-[#111827] placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-0"
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
                        className="h-10 w-full rounded-lg bg-[#111827] text-sm font-medium text-white hover:bg-[#1f2937] active:bg-[#0f172a] disabled:opacity-60"
                    >
                        {loading ? "Memuat..." : "Masuk"}
                    </Button>
                </form>
            </div>

            <p className="mt-5 text-center text-sm text-neutral-500">
                Belum punya akun?{" "}
                <Link
                    href="/register"
                    className="font-medium text-[#111827] underline-offset-4 hover:underline"
                >
                    Daftar sekarang
                </Link>
            </p>
        </div>
    )
}
