import { NextResponse } from "next/server";
import { broadcast } from "@/lib/ably";
import { verifyAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/notification-helper";

export async function POST(
	request: Request,
	{ params }: { params: { substepId: string } },
) {
	try {
		const { substepId } = params;

		const session = await verifyAuth(request);
		if (
			!session ||
			!["WORKER", "TEAM_LEAD", "ADMIN", "MANAGER"].includes(session.user.role)
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const substep = await prisma.jobSubStep.findUnique({
			where: { id: substepId },
			include: {
				step: {
					include: { job: { select: { id: true, title: true } } },
				},
			},
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
			where: { id: substepId },
			data: {
				startedAt: new Date(),
			},
		});

		// Notify admins when work starts (DB + Push)
		await sendAdminNotification(
			"İşe Başlandı",
			`"${substep.step.job.title}" - "${substep.title}" başlatıldı (${session.user.name || session.user.email})`,
			"INFO",
			`/admin/jobs/${substep.step.job.id}`,
			session.user.id,
		);

		// Socket.IO broadcast for real-time web notifications
		broadcast("substep:started", {
			substepId: substepId,
			jobId: substep.step.job.id,
			jobTitle: substep.step.job.title,
			substepTitle: substep.title,
			startedBy: session.user.name || session.user.email,
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
