import { createI18n } from 'vue-i18n';

import zh from './zh.json';
import zhErrorCode from './errorCode/zh.json';
import tw from './tw.json';
import twErrorCode from './errorCode/tw.json';
import en from './en.json';
import enErrorCode from './errorCode/en.json';
import store from '@/store';

const i18n = createI18n({
	locale: store.state.language,
	messages: {
		'zh-cn': { ...zh, ...zhErrorCode },
		'zh-tw': { ...tw, ...twErrorCode },
		en: { ...en, ...enErrorCode }
	}
});

export default i18n;
