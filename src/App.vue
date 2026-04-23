<template>
	<router-view />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScreenStore } from '@/store';
import { getLang } from '@/views/lib';
import i18n from '@/lang';

const language = getLang();

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
