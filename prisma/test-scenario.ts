// Test scenario: Gerçek bir iş akışı oluştur
import { prisma } from "../lib/db";

async function main() {
	console.log("🎬 Test senaryosu oluşturuluyor...");

	// 1. Customer ve Job oluştur
	const customer = await prisma.customer.findFirst({
		where: { user: { email: "customer@montaj.com" } },
	});

	if (!customer) {
		console.error("❌ Customer bulunamadı. Önce seed çalıştırın.");
		return;
	}

	const worker = await prisma.user.findUnique({
		where: { email: "worker@montaj.com" },
	});

	const admin = await prisma.user.findUnique({
		where: { email: "admin@montaj.com" },
	});

	if (!worker || !admin) {
		console.error("❌ Worker veya Admin bulunamadı.");
		return;
	}

	// 2. İş oluştur
	const job = await prisma.job.create({
		data: {
			title: "Klima Montajı - ABC Plaza",
			description:
				"ABC Plaza binasına 3 adet klima montajı yapılacak. Dış ve iç ünite montajı, boru çekimi ve test işlemleri dahil.",
			customerId: customer.id,
			creatorId: admin.id,
			status: "IN_PROGRESS",
			priority: "HIGH",
			location: "ABC Plaza, Kadıköy, İstanbul",
			scheduledDate: new Date("2025-11-25T09:00:00"),
			steps: {
				create: [
					{
						title: "Malzeme kontrolü",
						description: "Tüm malzemelerin eksiksiz olduğunu kontrol et",
						order: 1,
						isCompleted: true,
						completedAt: new Date(),
					},
					{
						title: "Dış ünite montajı",
						description: "3 adet dış üniteyi uygun konumlara monte et",
						order: 2,
						isCompleted: true,
						completedAt: new Date(),
					},
					{
						title: "İç ünite montajı",
						description: "İç üniteleri belirlenen odalara monte et",
						order: 3,
						isCompleted: true,
						completedAt: new Date(),
					},
					{
						title: "Boru çekimi ve bağlantı",
						description: "Bakır boru çekimi ve bağlantılarını yap",
						order: 4,
						isCompleted: false,
					},
					{
						title: "Elektrik bağlantıları",
						description: "Elektrik bağlantılarını yap ve test et",
						order: 5,
						isCompleted: false,
					},
					{
						title: "Gaz dolumu ve test",
						description: "Sistemlere gaz dolumu yap ve çalışma testi yap",
						order: 6,
						isCompleted: false,
					},
				],
			},
		},
	});

	// 3. Worker'a ata
	await prisma.jobAssignment.create({
		data: {
			jobId: job.id,
			workerId: worker.id,
		},
	});

	// 4. Bildirim oluştur
	await prisma.notification.create({
		data: {
			userId: worker.id,
			title: "Yeni İş Atandı",
			message: `${job.title} işi size atandı. Müşteri: ${customer.company}`,
			type: "INFO",
			link: `/worker/jobs/${job.id}`,
			isRead: false,
		},
	});

	console.log("✅ Test senaryosu oluşturuldu!");
	console.log("\n📋 Senaryo Detayları:");
	console.log(`İş: ${job.title}`);
	console.log(`Müşteri: ${customer.company}`);
	console.log(`Worker: ${worker.name}`);
	console.log(`Durum: ${job.status}`);
	console.log(`Tamamlanan adımlar: 3/6`);
	console.log("\n🎯 Test Adımları:");
	console.log("1. Worker olarak giriş yap (worker@montaj.com / worker123)");
	console.log("2. Dashboard'da yeni işi gör");
	console.log("3. İş detayına git ve kalan adımları tamamla");
	console.log('4. "İşi Tamamla" butonuna tıkla');
	console.log("5. Admin olarak giriş yap (admin@montaj.com / admin123)");
	console.log('6. Dashboard\'da "Bekleyen Onay" kartına tıkla');
	console.log("7. İşi onayla veya reddet");
	console.log(
		"8. Customer olarak giriş yap (customer@montaj.com / customer123)",
	);
	console.log("9. Dashboard'da işi ve ilerlemeyi gör");
}

main()
	.catch((e) => {
		console.error("❌ Hata:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
