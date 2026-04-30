<template>
	<a-config-provider :locale="locale">
		<router-view />
	</a-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScreenStore } from '@/store';
import { getLang } from '@/views/lib';
import i18n from '@/lang';

import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import type { ArcoLang } from '@arco-design/web-vue/es/locale/interface';

const languageMap: Record<SupportLanguageType, ArcoLang> = {
	'en': enUS,
	'zh-cn': zhCN
};
const language = getLang();
const locale = computed(() => {
	return languageMap[language.value] || zhCN;
});

watch(language, () => {
	i18n.global.locale = language.value;
});

// 适应窗口大小
const store = useScreenStore();
const setWindowSize = () => store.setScreenType();

onMounted(() => {
	let waitForResizeEndTimer: null | number = null;

	window.onresize = () => {
		const waitTime = 500;

		if (waitForResizeEndTimer === null) {
			waitForResizeEndTimer = window.setTimeout(() => {
				setWindowSize();
			}, waitTime);
		} else {
			clearTimeout(waitForResizeEndTimer);
			waitForResizeEndTimer = window.setTimeout(() => {
				setWindowSize();
			}, waitTime);
		}
	};
});

// 设置浏览器标签的title
const route = useRoute();

watch(
	() => route.path,
	() => {
		document.title = (route.meta.i18nNavigateName as string) || 'vite app';
	}
);
</script>
