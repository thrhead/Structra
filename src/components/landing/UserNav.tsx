"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export function UserNav() {
	const { data: session, status } = useSession();
	const t = useTranslations("Home");
	const t_nav = useTranslations("Navigation");

	if (status === "loading") {
		return (
			<div className="w-24 h-10 bg-slate-900/50 animate-pulse rounded-full border border-slate-800" />
		);
	}

	return (
		<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
			{session ? (
				<Link
					href={`/${session.user.role.toLowerCase()}`}
					className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors border border-slate-800 px-6 py-3 rounded-full bg-slate-900/50 backdrop-blur-sm"
				>
					[ {t_nav("dashboard")} ]
				</Link>
			) : (
				<Link
					href="/login"
					className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-colors border border-slate-800 px-6 py-3 rounded-full bg-slate-900/50 backdrop-blur-sm"
				>
					[ {t("loginButton")} ]
				</Link>
			)}
		</motion.div>
	);
}
