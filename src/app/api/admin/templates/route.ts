import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
	try {
		const session = await verifyAuth(req);

		if (!session) {
			return new NextResponse("Yetkisiz Erişim", { status: 401 });
		}

		const templates = await prisma.jobTemplate.findMany({
			include: {
				steps: {
					orderBy: { order: "asc" },
					include: {
						subSteps: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(templates);
	} catch (error) {
		console.error("Templates fetch error:", error);
		return new NextResponse("Sunucu Hatası", { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const session = await verifyAuth(req);
		if (
			!session ||
			(session.user.role !== "ADMIN" && session.user.role !== "TEAM_LEAD")
		) {
			return new NextResponse("Yetkisiz Erişim", { status: 401 });
		}

		const body = await req.json();
		const { name, description, steps } = body;

		if (!name) {
			return new NextResponse("Şablon adı gereklidir", { status: 400 });
		}

		const template = await prisma.jobTemplate.create({
			data: {
				name,
				description,
				steps: {
					create: steps?.map((step: any, index: number) => ({
						title: step.title,
						order: index + 1,
						subSteps: {
							create: step.subSteps?.map((sub: any, subIndex: number) => ({
								title: sub.title,
								order: subIndex + 1,
							})),
						},
					})),
				},
			},
			include: {
				steps: {
					include: { subSteps: true },
				},
			},
		});

		return NextResponse.json(template);
	} catch (error) {
		console.error("Template create error:", error);
		return new NextResponse("Sunucu Hatası", { status: 500 });
	}
}
