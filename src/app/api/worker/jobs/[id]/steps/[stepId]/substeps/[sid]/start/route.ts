import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/db";

export async function POST(
	request: Request,
	props: { params: Promise<{ id: string; stepId: string; sid: string }> },
) {
	try {
		const params = await props.params;

		const _session = await verifyAuth(request);
		const { sid } = params;

		const substep = await prisma.jobSubStep.findUnique({
			where: { id: sid },
		});

		if (!substep) {
			return NextResponse.json({ error: "Substep not found" }, { status: 404 });
		}

		if (substep.startedAt) {
			return NextResponse.json(
				{ error: "Substep already started" },
				{ status: 400 },
			);
		}

		const updatedSubstep = await prisma.jobSubStep.update({
			where: { id: sid },
			data: {
				startedAt: new Date(),
			},
		});

		return NextResponse.json(updatedSubstep);
	} catch (error: any) {
		console.error("Error starting substep:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error.message || String(error),
			},
			{ status: 500 },
		);
	}
}
