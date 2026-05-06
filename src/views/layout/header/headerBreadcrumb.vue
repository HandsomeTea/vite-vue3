<template>
	<a-breadcrumb separator="/">
		<template v-for="(navigate, i) in navigateData">
			<a-breadcrumb-item v-if="i <= 1 && ((isHideMenu && platform === 'phone') || platform !== 'phone')"
				:key="i + '1'"
				@click="navigate.path && navigate.path !== $route.path ? redirectTo(navigate.path) : null">
				{{ $t(navigate.nameI18n) }}
			</a-breadcrumb-item>
			<a-breadcrumb-item v-if="i > 1" :key="i + '2'">
				{{ $t(navigate.nameI18n) }}
			</a-breadcrumb-item>
		</template>
	</a-breadcrumb>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getMenuStatus, getScreenSize, redirectTo } from '@/views/lib';
import { useRoute, type RouteLocationMatched } from 'vue-router';

const route = useRoute();
const navigateData = ref<Array<{ path?: string; nameI18n: string }>>([]);
const dealPathInfo = (matchedInfo: Array<RouteLocationMatched>) => {
	navigateData.value = [];
	matchedInfo.map(a => {
		if (a.path !== '/') {
			if (typeof a.meta.i18nNavigateGroupName === 'string') {
				navigateData.value.push({
					nameI18n: a.meta.i18nNavigateGroupName
				});
			}
			navigateData.value.push({
				path: a.path,
				nameI18n: (a.meta.i18nNavigateName as string) || 'vite app'
			});
		}
	});
};

onMounted(() => {
	dealPathInfo(route.matched);
});
watch(
	() => route.path,
	() => {
		dealPathInfo(route.matched);
	}
);
const isHideMenu = getMenuStatus();
const platform = getScreenSize();

</script>

<style lang="less" scoped></style>
