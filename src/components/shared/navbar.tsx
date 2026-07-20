"use client"

import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <img
                        src="/logbooku-logo.png"
                        alt="Logbooku Logo"
                        className="h-12 w-auto object-contain"
                    />
                    <nav className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className={`text-sm font-medium transition-colors relative py-1 ${
                                pathname === "/dashboard"
                                    ? "text-[#1E3A8A]"
                                    : "text-neutral-500 hover:text-[#1E3A8A]"
                            }`}
                        >
                            Dashboard
                            {pathname === "/dashboard" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A] rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => router.push("/profile")}
                            className={`text-sm font-medium transition-colors relative py-1 ${
                                pathname === "/profile"
                                    ? "text-[#1E3A8A]"
                                    : "text-neutral-500 hover:text-[#1E3A8A]"
                            }`}
                        >
                            Profil
                            {pathname === "/profile" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A] rounded-full" />
                            )}
                        </button>
                    </nav>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-neutral-500 hover:text-[#1E3A8A] hover:bg-neutral-100"
                >
                    Keluar
                </Button>
            </div>
        </header>
    )
}
