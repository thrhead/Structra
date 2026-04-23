import { compare } from "bcryptjs";
import { prisma } from "../../lib/db";

async function check() {
	const email = "manager@montaj.com";
	const password = process.env.MANAGER_PASSWORD;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		console.log("❌ Kullanıcı bulunamadı!");
		return;
	}

	console.log("✅ Kullanıcı bulundu:", user.email);
	console.log("Rol:", user.role);
	console.log("Aktif mi:", user.isActive);
	console.log("Hash:", user.passwordHash);

	const isValid = await compare(password, user.passwordHash);
	console.log("🔐 Şifre Doğrulama:", isValid ? "BAŞARILI" : "BAŞARISIZ");
}

check()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
