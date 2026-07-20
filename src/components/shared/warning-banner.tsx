interface WarningBannerProps {
    isVisible: boolean
}

export default function WarningBanner({ isVisible }: WarningBannerProps) {
    if (!isVisible) return null

    return (
        <div className="w-full bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-3 flex items-start gap-2.5">
            <svg
                className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#B45309]">
                    Profil Belum Lengkap
                </span>
                <span className="text-xs text-[#B45309]/90 leading-relaxed">
                    Nama Mitra/Instansi, Mentor Lapangan, atau Dosen Pembimbing Anda masih kosong. Silakan lengkapi profil Anda pada tab Profil agar dokumen cetak logbook dapat di-generate dengan tanda tangan pembimbing resmi.
                </span>
            </div>
        </div>
    )
}
