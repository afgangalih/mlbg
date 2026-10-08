import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    ImageRun
} from "docx"

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

const formatDate = (dateStr: string) => {
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

const formatTime = (time: string) => {
    if (!time || time === "-") return "-"
    return time.replace(":", ".")
}

let cachedLogoBuffer: Uint8Array | null = null

export async function generateLogbookDocx(profile: Profile | null, entries: LogbookEntry[]): Promise<Blob> {
    const defaultBorder = {
        style: BorderStyle.SINGLE,
        size: 8,
        color: "000000"
    }

    const cellBorders = {
        top: defaultBorder,
        bottom: defaultBorder,
        left: defaultBorder,
        right: defaultBorder
    }

    const borderlessCellBorders = {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" }
    }

    const kopBottomBorder = {
        style: BorderStyle.SINGLE,
        size: 18,
        color: "000000"
    }

    if (!cachedLogoBuffer) {
        try {
            const res = await fetch("/polinema-gray.jpg")
            if (res.ok) {
                const arrBuffer = await res.arrayBuffer()
                cachedLogoBuffer = new Uint8Array(arrBuffer)
            }
        } catch {}
    }
    const logoBuffer = cachedLogoBuffer

    const kopChildren: any[] = []
    if (logoBuffer) {
        kopChildren.push(
            new ImageRun({
                type: "jpg",
                data: logoBuffer,
                transformation: {
                    width: 76,
                    height: 76
                }
            })
        )
    }

    const kopTable = new Table({
        width: {
            size: 9360,
            type: WidthType.DXA
        },
        columnWidths: [1400, 7960],
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 1400, type: WidthType.DXA },
                        borders: {
                            ...borderlessCellBorders,
                            bottom: kopBottomBorder
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: kopChildren
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: 7960, type: WidthType.DXA },
                        borders: {
                            ...borderlessCellBorders,
                            bottom: kopBottomBorder
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 20 },
                                children: [
                                    new TextRun({
                                        text: "KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 20 },
                                children: [
                                    new TextRun({
                                        text: "POLITEKNIK NEGERI MALANG",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 28
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 20 },
                                children: [
                                    new TextRun({
                                        text: profile?.study_program
                                            ? `JURUSAN ${profile.study_program.toUpperCase()}`
                                            : "JURUSAN TEKNOLOGI INFORMASI",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 20 },
                                children: [
                                    new TextRun({
                                        text: "Jalan Soekarno Hatta Nomor 9, Jatimulyo, Lowokwaru, Malang 65141",
                                        font: "Times New Roman",
                                        size: 20
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 20 },
                                children: [
                                    new TextRun({
                                        text: "Telepon (0341) 404424, 404425; Faksimile (0341) 404420",
                                        font: "Times New Roman",
                                        size: 20
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 0, after: 40 },
                                children: [
                                    new TextRun({
                                        text: "Laman www.polinema.ac.id",
                                        font: "Times New Roman",
                                        size: 20
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    })

    const titleSpacing = new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: "LOG BOOK KEGIATAN",
                bold: true,
                size: 24,
                font: "Times New Roman"
            })
        ]
    })

    const subtitleSpacing = new Paragraph({
        spacing: { before: 0, after: 240 },
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: "PROGRAM MAGANG INDUSTRI",
                bold: true,
                size: 24,
                font: "Times New Roman"
            })
        ]
    })

    const metadataTable = new Table({
        width: {
            size: 9360,
            type: WidthType.DXA
        },
        columnWidths: [2500, 400, 6460],
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
        },
        rows: [
            ["Nama", profile?.full_name],
            ["NIM", profile?.nim],
            ["Program Studi", profile?.study_program],
            ["Nama Mitra Industri", profile?.company_name]
        ].map(([label, val]) => (
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 2500, type: WidthType.DXA },
                        borders: borderlessCellBorders,
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: label,
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: 400, type: WidthType.DXA },
                        borders: borderlessCellBorders,
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: ":",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: 6460, type: WidthType.DXA },
                        borders: borderlessCellBorders,
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: val || "..................................................",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ))
    })

    const emptyMetadataSpacing = new Paragraph({
        spacing: { before: 240, after: 120 },
        children: []
    })

    const headersRow = new TableRow({
        children: [
            { text: "Hari, Tanggal", width: 2300, align: AlignmentType.CENTER },
            { text: "Jam Masuk", width: 1100, align: AlignmentType.CENTER },
            { text: "Jam Pulang", width: 1100, align: AlignmentType.CENTER },
            { text: "Kegiatan", width: 4860, align: AlignmentType.LEFT }
        ].map((col) => (
            new TableCell({
                width: { size: col.width, type: WidthType.DXA },
                borders: cellBorders,
                children: [
                    new Paragraph({
                        alignment: col.align,
                        children: [
                            new TextRun({
                                text: col.text,
                                bold: true,
                                font: "Times New Roman",
                                size: 24
                            })
                        ]
                    })
                ]
            })
        ))
    })

    const bodyRows = entries.map((entry) => (
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 2300, type: WidthType.DXA },
                    borders: cellBorders,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: formatDate(entry.date),
                                    font: "Times New Roman",
                                    size: 24
                                })
                            ]
                        })
                    ]
                }),
                new TableCell({
                    width: { size: 1100, type: WidthType.DXA },
                    borders: cellBorders,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: entry.status === "Hadir" ? formatTime(entry.timeIn) : "-",
                                    font: "Times New Roman",
                                    size: 24
                                })
                            ]
                        })
                    ]
                }),
                new TableCell({
                    width: { size: 1100, type: WidthType.DXA },
                    borders: cellBorders,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: entry.status === "Hadir" ? formatTime(entry.timeOut) : "-",
                                    font: "Times New Roman",
                                    size: 24
                                })
                            ]
                        })
                    ]
                }),
                new TableCell({
                    width: { size: 4860, type: WidthType.DXA },
                    borders: cellBorders,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: entry.activity,
                                    font: "Times New Roman",
                                    size: 24
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    ))

    const logbookTable = new Table({
        width: {
            size: 9360,
            type: WidthType.DXA
        },
        columnWidths: [2300, 1100, 1100, 4860],
        rows: [headersRow, ...bodyRows]
    })

    const emptyTableSpacing = new Paragraph({
        spacing: { before: 360, after: 120 },
        children: []
    })

    const studentSignatureParagraphs = [
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: "Mahasiswa,",
                    font: "Times New Roman",
                    size: 24
                })
            ]
        }),
        new Paragraph({
            spacing: { before: 720, after: 0 },
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: profile?.full_name || "...................................",
                    bold: true,
                    font: "Times New Roman",
                    size: 24
                })
            ]
        }),
        new Paragraph({
            spacing: { before: 240, after: 240 },
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: "Mengetahui,",
                    bold: true,
                    font: "Times New Roman",
                    size: 24
                })
            ]
        })
    ]

    const signaturesTable = new Table({
        width: {
            size: 9360,
            type: WidthType.DXA
        },
        columnWidths: [4680, 4680],
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 4680, type: WidthType.DXA },
                        borders: borderlessCellBorders,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "Dosen Pembimbing,",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                spacing: { before: 800, after: 0 },
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "................................................",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: profile?.lecturer_name || "",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        width: { size: 4680, type: WidthType.DXA },
                        borders: borderlessCellBorders,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "Pembimbing Lapangan,",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                spacing: { before: 800, after: 0 },
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "................................................",
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: profile?.mentor_name || "",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 24
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    })

    const doc = new Document({
        sections: [{
            children: [
                kopTable,
                titleSpacing,
                subtitleSpacing,
                metadataTable,
                emptyMetadataSpacing,
                logbookTable,
                emptyTableSpacing,
                ...studentSignatureParagraphs,
                signaturesTable
            ]
        }]
    })

    return await Packer.toBlob(doc)
}
