import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const token = authHeader.split(" ")[1]

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false
            }
        })

        const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token)
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { draft } = await req.json()
        if (!draft || typeof draft !== "string" || draft.trim().length === 0) {
            return NextResponse.json({ error: "Draft is required" }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
        const prompt = `Ubah draf catatan aktivitas magang berikut menjadi kalimat formal logbook magang industri yang padat, singkat, dan tepat ke poin utama.

Kriteria Utama:
1. SANGAT SINGKAT & PADAT: Maksimal 1-2 kalimat (idealnya 1 kalimat ringkas). Jangan berbelit-belit atau terlalu panjang agar muat rapi di kolom logbook.
2. DIAWALI KATA KERJA AKTIF: Mulai dengan kata kerja aktif formal seperti "Melakukan...", "Merancang...", "Mengembangkan...", "Mengikuti...", "Menyelesaikan...", "Membuat...", "Menganalisis...".
3. BAHASA FORMAL AKADEMIK/INDUSTRI: Gunakan ejaan resmi baku (PUEBI/EYD) tanpa istilah informal/slang.
4. HANYA OUTPUT HASIL: Berikan HANYA teks hasil parafrase akhir tanpa pengantar, tanpa penutup, tanpa tanda kutip pembungkus.

Draf Informal:
${draft.trim()}`

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            return NextResponse.json({ error: errData.error?.message || "Failed to communicate with Gemini API" }, { status: response.status })
        }

        const resData = await response.json()
        const resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text || ""
        
        return NextResponse.json({ result: resultText.trim() })
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
