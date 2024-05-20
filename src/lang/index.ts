import { createI18n } from 'vue-i18n';

import zh from './zh.json';
import zhErrorCode from './errorCode/zh.json';
import tw from './tw.json';
import twErrorCode from './errorCode/tw.json';
import en from './en.json';
import enErrorCode from './errorCode/en.json';

const i18n = createI18n({
	locale: localStorage.getItem('language') || navigator.language.toLowerCase(),
	messages: {
		'zh-cn': { ...zh, ...zhErrorCode },
		'zh-tw': { ...tw, ...twErrorCode },
		en: { ...en, ...enErrorCode }
	}
});

export default i18n;
