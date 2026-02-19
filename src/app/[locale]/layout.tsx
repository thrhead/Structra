import { ToastProvider } from "@/components/providers/toast-provider";
import { Providers } from "@/components/providers/providers";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        {children}
      </Providers>
      <ToastProvider />
    </NextIntlClientProvider>
  );
}
