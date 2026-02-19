import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  if (!locale || !['en', 'tr'].includes(locale)) {
    locale = 'tr';
  }

  let messages;
  try {
    // Corrected path after move
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = {}; 
  }
 
  return {
    locale,
    messages
  };
});
