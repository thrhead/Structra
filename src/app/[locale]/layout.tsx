import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers/providers";
import { ToastProvider } from "@/components/providers/toast-provider";

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const { locale } = params;
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<Providers>{children}</Providers>
			<ToastProvider />
		</NextIntlClientProvider>
	);
}
