import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    )
}
