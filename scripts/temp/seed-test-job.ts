import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Bu script test için alt görevli bir iş oluşturur

	// Önce bir müşteri bulalım veya oluşturalım
	const customer = await prisma.customer.findFirst();

	if (!customer) {
		console.log("No customers found. Please create a customer first.");
		return;
	}

	// Admin kullanıcısını bulalım
	const admin = await prisma.user.findFirst({
		where: { role: "ADMIN" },
	});

	if (!admin) {
		console.log("No admin found.");
		return;
	}

	// Yeni bir iş oluştur
	const job = await prisma.job.create({
		data: {
			title: "Elektrik Panosu Montajı (Alt Görevli)",
			description:
				"Fabrika elektrik panosu montaj işi - Alt görevler ve fotoğraf testi",
			customerId: customer.id,
			creatorId: admin.id,
			status: "IN_PROGRESS",
			priority: "HIGH",
			location: "Fabrika Ana Bina",
			scheduledDate: new Date(),
			steps: {
				create: [
					{
						title: "Saha Hazırlığı",
						description: "Montaj alanının temizlenmesi ve hazırlanması",
						order: 1,
						isCompleted: false,
						subSteps: {
							create: [
								{ title: "Alan temizliği", order: 1, isCompleted: false },
								{ title: "Malzeme kontrolü", order: 2, isCompleted: false },
								{
									title: "Güvenlik ekipmanları hazırlığı",
									order: 3,
									isCompleted: false,
								},
							],
						},
					},
					{
						title: "Pano Montajı",
						description: "Ana elektrik panosunun montajı",
						order: 2,
						isCompleted: false,
						subSteps: {
							create: [
								{
									title: "Pano kasasının yerleştirilmesi",
									order: 1,
									isCompleted: false,
								},
								{ title: "Sabitleme işlemi", order: 2, isCompleted: false },
								{ title: "Hizalama kontrolü", order: 3, isCompleted: false },
							],
						},
					},
					{
						title: "Kablolama",
						description: "Pano içi kablolama işlemleri",
						order: 3,
						isCompleted: false,
						subSteps: {
							create: [
								{
									title: "Ana besleme kabloları",
									order: 1,
									isCompleted: false,
								},
								{ title: "Dağıtım kabloları", order: 2, isCompleted: false },
								{
									title: "Topraklama bağlantıları",
									order: 3,
									isCompleted: false,
								},
								{ title: "Etiketleme", order: 4, isCompleted: false },
							],
						},
					},
					{
						title: "Test ve Devreye Alma",
						description: "Sistemin test edilmesi ve devreye alınması",
						order: 4,
						isCompleted: false,
						subSteps: {
							create: [
								{ title: "Gerilim kontrolü", order: 1, isCompleted: false },
								{ title: "İzolasyon testi", order: 2, isCompleted: false },
								{ title: "Yük testi", order: 3, isCompleted: false },
								{ title: "Belgelendirme", order: 4, isCompleted: false },
							],
						},
					},
				],
			},
		},
	});

	console.log("✅ Test işi oluşturuldu!");
	console.log(`📋 İş ID: ${job.id}`);
	console.log(`📝 İş Adı: ${job.title}`);
	console.log("🔹 4 ana adım ve her birinde alt görevler eklendi");
	console.log("\n📌 Worker panelinden bu işi test edebilirsiniz:");
	console.log(`   http://localhost:3000/worker/jobs/${job.id}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
