import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🔍 Veritabanı kontrolü yapılıyor...\n");

	// Tüm işleri getir
	const jobs = await prisma.job.findMany({
		include: {
			steps: {
				include: {
					subSteps: true,
				},
			},
		},
	});

	console.log(`📋 Toplam ${jobs.length} iş bulundu\n`);

	for (const job of jobs) {
		console.log(`\n📦 İş: ${job.title} (ID: ${job.id})`);
		console.log(`   Adım sayısı: ${job.steps.length}`);

		let totalSubSteps = 0;
		for (const step of job.steps) {
			if (step.subSteps && step.subSteps.length > 0) {
				console.log(`   ✅ ${step.title}: ${step.subSteps.length} alt görev`);
				totalSubSteps += step.subSteps.length;
			} else {
				console.log(`   ❌ ${step.title}: Alt görev yok`);
			}
		}

		console.log(`   Toplam alt görev: ${totalSubSteps}`);
	}

	// Alt görev modelini direkt kontrol et
	const allSubSteps = await prisma.jobSubStep.findMany();
	console.log(
		`\n📊 Veritabanında toplam ${allSubSteps.length} alt görev kaydı var`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
