import { verifyAdmin } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(req: Request) {
    try {
        const session = await verifyAdmin(req)
        if (!session) {
            return new NextResponse("Yetkisiz Erişim", { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return new NextResponse("Dosya gerekli", { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
            return new NextResponse("Excel dosyası boş", { status: 400 })
        }

        console.log("Processing template import:", jsonData.length, "rows")

        let successCount = 0
        let errorCount = 0
        const errors: string[] = []

        // Group rows by Template Name
        const templatesMap = new Map<string, any[]>()

        for (const row of jsonData as any[]) {
            const templateName = row["Template Name"] || row["Şablon Adı"]
            if (!templateName) continue

            if (!templatesMap.has(templateName)) {
                templatesMap.set(templateName, [])
            }
            templatesMap.get(templateName)?.push(row)
        }

        for (const [name, rows] of templatesMap) {
            try {
                await prisma.$transaction(async (tx) => {
                    const params = {
                        name: name,
                        description: rows[0]["Description"] || rows[0]["Açıklama"] || `${name} iş şablonu`
                    }

                    const existing = await tx.jobTemplate.findUnique({ where: { name } })
                    if (existing) {
                        throw new Error(`'${name}' isminde bir şablon zaten var.`)
                    }

                    const template = await tx.jobTemplate.create({
                        data: {
                            name: params.name,
                            description: params.description
                        }
                    })

                    const stepsMap = new Map<string, any[]>()
                    rows.forEach((row: any) => {
                        const stepTitle = row["Step Title"] || row["Adım Başlığı"]
                        if (!stepTitle) return
                        if (!stepsMap.has(stepTitle)) stepsMap.set(stepTitle, [])
                        stepsMap.get(stepTitle)?.push(row)
                    })

                    let stepOrder = 1
                    for (const [stepTitle, stepRows] of stepsMap) {
                        const step = await tx.templateStep.create({
                            data: {
                                templateId: template.id,
                                title: stepTitle,
                                order: stepOrder++
                            }
                        })

                        const subStepsData = stepRows
                            .map((sRow, index) => {
                                const subStepTitle = sRow["SubStep Title"] || sRow["Alt Adım"]
                                if (!subStepTitle) return null
                                return {
                                    stepId: step.id,
                                    title: subStepTitle,
                                    order: index + 1
                                }
                            })
                            .filter((item): item is { stepId: string, title: string, order: number } => item !== null)

                        if (subStepsData.length > 0) {
                            await tx.templateSubStep.createMany({
                                data: subStepsData
                            })
                        }
                    }
                }, {
                    timeout: 30000 // 30 seconds timeout
                })
                successCount++
            } catch (error: any) {
                console.error(`Error importing template ${name}:`, error)
                errorCount++
                errors.push(`Şablon "${name}": ${error.message}`)
            }
        }

        return NextResponse.json({
            success: true,
            count: successCount,
            errors: errors.length > 0 ? errors : undefined
        })

    } catch (error) {
        console.error("Template import error:", error)
        return new NextResponse("Sunucu Hatası", { status: 500 })
    }
}
