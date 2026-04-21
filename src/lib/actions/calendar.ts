"use server";

import { auth } from "@/lib/auth";
import { getCalendarEvents } from "@/lib/data/calendar";

export async function getCalendarEventsAction(start: Date, end: Date) {
	const session = await auth();

	if (!session) {
		throw new Error("Yetkisiz işlem");
	}

	return await getCalendarEvents({
		start,
		end,
		userId: session.user.id,
		role: session.user.role,
	});
}
