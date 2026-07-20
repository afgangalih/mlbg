type Profile = {
    full_name: string
    nim: string
    study_program: string
    company_name: string
    lecturer_name: string
    mentor_name: string
}

type LogbookEntry = {
    id: string
    date: string
    timeIn: string
    timeOut: string
    activity: string
    status: "Hadir" | "Sakit" | "Izin" | "Libur"
}

const formatDate = (dateStr: string): string => {
    try {
        const date = new Date(dateStr + "T00:00:00")
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    } catch {
        return dateStr
    }
}

const formatTime = (time: string): string => {
    if (!time || time === "-") return "-"
    return time.replace(":", ".")
}

const toBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

export async function generateLogbookPdf(profile: Profile | null, entries: LogbookEntry[], filename: string): Promise<void> {
    const pdfMake = (await import("pdfmake/build/pdfmake")).default as any
    const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default as any

    pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Medium.ttf",
            italics: "Roboto-Italic.ttf",
            bolditalics: "Roboto-MediumItalic.ttf"
        }
    }

    let logoBase64: string | null = null
    try {
        logoBase64 = await toBase64("/polinema-gray.jpg")
    } catch {}

    const kopContent: any[] = []
    if (logoBase64) {
        kopContent.push({
            image: logoBase64,
            width: 72,
            height: 72,
            alignment: "center"
        })
    } else {
        kopContent.push({ text: "", width: 72 })
    }

    kopContent.push({
        stack: [
            {
                text: "KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI",
                style: "kopKementerian",
                alignment: "center"
            },
            {
                text: "POLITEKNIK NEGERI MALANG",
                style: "kopPolinema",
                alignment: "center"
            },
            {
                text: profile?.study_program
                    ? `JURUSAN ${profile.study_program.toUpperCase()}`
                    : "JURUSAN TEKNOLOGI INFORMASI",
                style: "kopJurusan",
                alignment: "center"
            },
            {
                text: "Jalan Soekarno Hatta Nomor 9, Jatimulyo, Lowokwaru, Malang 65141",
                style: "kopAlamat",
                alignment: "center"
            },
            {
                text: "Telepon (0341) 404424, 404425; Faksimile (0341) 404420",
                style: "kopAlamat",
                alignment: "center"
            },
            {
                text: "Laman www.polinema.ac.id",
                style: "kopAlamat",
                alignment: "center",
                margin: [0, 0, 0, 4]
            }
        ],
        margin: [12, 0, 0, 0]
    })

    const bodyRows: any[][] = entries.map((entry) => [
        {
            text: formatDate(entry.date),
            style: "tableCell",
            alignment: "center"
        },
        {
            text: entry.status === "Hadir" ? formatTime(entry.timeIn) : "-",
            style: "tableCell",
            alignment: "center"
        },
        {
            text: entry.status === "Hadir" ? formatTime(entry.timeOut) : "-",
            style: "tableCell",
            alignment: "center"
        },
        {
            text: entry.activity,
            style: "tableCell",
            alignment: "left"
        }
    ])

    const docDefinition: any = {
        pageSize: "A4",
        pageMargins: [70, 56, 56, 56],

        defaultStyle: {
            fontSize: 11,
            lineHeight: 1.3
        },

        styles: {
            kopKementerian: {
                fontSize: 11,
                bold: true
            },
            kopPolinema: {
                fontSize: 14,
                bold: true
            },
            kopJurusan: {
                fontSize: 11,
                bold: true
            },
            kopAlamat: {
                fontSize: 9
            },
            title: {
                fontSize: 12,
                bold: true
            },
            metaLabel: {
                fontSize: 11,
                bold: true
            },
            metaValue: {
                fontSize: 11
            },
            tableHeader: {
                fontSize: 11,
                bold: true
            },
            tableCell: {
                fontSize: 11
            },
            signLabel: {
                fontSize: 11
            },
            signName: {
                fontSize: 11,
                bold: true
            }
        },

        content: [
            {
                columns: kopContent,
                margin: [0, 0, 0, 0]
            },
            {
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        y1: 3,
                        x2: 465,
                        y2: 3,
                        lineWidth: 3,
                        lineColor: "#000000"
                    },
                    {
                        type: "line",
                        x1: 0,
                        y1: 7,
                        x2: 465,
                        y2: 7,
                        lineWidth: 1,
                        lineColor: "#000000"
                    }
                ],
                margin: [0, 4, 0, 12]
            },
            {
                text: "LOG BOOK KEGIATAN",
                style: "title",
                alignment: "center",
                margin: [0, 0, 0, 2]
            },
            {
                text: "PROGRAM MAGANG INDUSTRI",
                style: "title",
                alignment: "center",
                margin: [0, 0, 0, 14]
            },
            {
                table: {
                    widths: [120, "*"],
                    body: [
                        [
                            { text: "Nama", style: "metaLabel", border: [false, false, false, false] },
                            { text: `: ${profile?.full_name || "...................................................................."}`, style: "metaValue", border: [false, false, false, false] }
                        ],
                        [
                            { text: "NIM", style: "metaLabel", border: [false, false, false, false] },
                            { text: `: ${profile?.nim || "...................................................................."}`, style: "metaValue", border: [false, false, false, false] }
                        ],
                        [
                            { text: "Program Studi", style: "metaLabel", border: [false, false, false, false] },
                            { text: `: ${profile?.study_program || "...................................................................."}`, style: "metaValue", border: [false, false, false, false] }
                        ],
                        [
                            { text: "Nama Mitra Industri", style: "metaLabel", border: [false, false, false, false] },
                            { text: `: ${profile?.company_name || "...................................................................."}`, style: "metaValue", border: [false, false, false, false] }
                        ]
                    ]
                },
                layout: "noBorders",
                margin: [0, 0, 0, 14]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [115, 55, 55, "*"],
                    body: [
                        [
                            { text: "Hari, Tanggal", style: "tableHeader", alignment: "center", fillColor: "#F5F5F5" },
                            { text: "Jam Masuk", style: "tableHeader", alignment: "center", fillColor: "#F5F5F5" },
                            { text: "Jam Pulang", style: "tableHeader", alignment: "center", fillColor: "#F5F5F5" },
                            { text: "Kegiatan", style: "tableHeader", alignment: "left", fillColor: "#F5F5F5" }
                        ],
                        ...(entries.length === 0
                            ? [[
                                { text: "Belum ada kegiatan tercatat.", colSpan: 4, alignment: "center", style: "tableCell", border: [true, true, true, true] },
                                {}, {}, {}
                            ]]
                            : bodyRows
                        )
                    ]
                },
                layout: {
                    hLineWidth: () => 0.75,
                    vLineWidth: () => 0.75,
                    hLineColor: () => "#000000",
                    vLineColor: () => "#000000",
                    paddingLeft: () => 6,
                    paddingRight: () => 6,
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                },
                margin: [0, 0, 0, 24]
            },
            {
                columns: [
                    { text: "", width: "*" },
                    {
                        stack: [
                            { text: "Mahasiswa,", style: "signLabel", alignment: "center" },
                            { text: "\n\n\n\n" },
                            { text: profile?.full_name || ".......................................", style: "signName", alignment: "center" }
                        ],
                        width: 180
                    },
                    { text: "", width: 40 }
                ],
                margin: [0, 0, 0, 24]
            },
            {
                text: "Mengetahui,",
                style: "metaLabel",
                alignment: "center",
                margin: [0, 0, 0, 24]
            },
            {
                columns: [
                    {
                        stack: [
                            { text: "Dosen Pembimbing,", style: "signLabel", alignment: "center" },
                            { text: "\n\n\n\n" },
                            { text: "................................................", style: "signLabel", alignment: "center" },
                            { text: profile?.lecturer_name || "", style: "signName", alignment: "center" }
                        ],
                        width: "*"
                    },
                    {
                        stack: [
                            { text: "Pembimbing Lapangan,", style: "signLabel", alignment: "center" },
                            { text: "\n\n\n\n" },
                            { text: "................................................", style: "signLabel", alignment: "center" },
                            { text: profile?.mentor_name || "", style: "signName", alignment: "center" }
                        ],
                        width: "*"
                    }
                ]
            }
        ]
    }

    pdfMake.createPdf(docDefinition).download(filename)
}
