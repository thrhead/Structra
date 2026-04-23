import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import tr from "../locales/tr.json";

const resources = {
	tr: { translation: tr },
	en: { translation: en },
};

const LANGUAGE_KEY = "@app_language";

const languageDetector = {
	type: "languageDetector",
	async: true,
	detect: async (callback) => {
		try {
			const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
			if (savedLanguage) {
				return callback(savedLanguage);
			}

			const deviceLocale = Localization.getLocales()[0].languageCode;
			const fallbackLanguage = resources[deviceLocale] ? deviceLocale : "tr";
			callback(fallbackLanguage);
		} catch (_error) {
			callback("tr");
		}
	},
	init: () => {},
	cacheUserLanguage: async (language) => {
		try {
			await AsyncStorage.setItem(LANGUAGE_KEY, language);
		} catch (_error) {}
	},
};

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "tr",
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
