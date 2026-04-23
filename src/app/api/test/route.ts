import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const count = await prisma.jobSubStep.count();
		return NextResponse.json({ status: "ok", count });
	} catch (error: any) {
		console.error("[DEBUG] Test route error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
