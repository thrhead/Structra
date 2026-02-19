import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  if (!locale || !['en', 'tr'].includes(locale)) {
    locale = 'tr';
  }

  let messages;
  try {
    // Look in src/messages where we moved them
    messages = (await import(`./src/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = {}; 
  }
 
  return {
    locale,
    messages
  };
});
