<template>
	<a-breadcrumb separator="/">
		<template v-for="(navigate, i) in navigateData">
			<a-breadcrumb-item
				v-if="i <= 1 && ((isHideMenu && platform === 'phone') || platform !== 'phone')"
				:key="i + '1'"
				@click="navigate.path ? redirectTo(navigate.path) : null"
				:class="navigate.path ? 'cursor-pointer text-blue-600' : ''"
			>
				{{ $t(navigate.name) }}
			</a-breadcrumb-item>
			<a-breadcrumb-item v-if="i > 1" :key="i + '2'">
				{{ $t(navigate.name) }}
			</a-breadcrumb-item>
		</template>
	</a-breadcrumb>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getMenuStatus, getScreenSize, redirectTo } from '@/views/lib';
import { useRoute } from 'vue-router';

interface RouterMeta {
	title: string;
	page: string;
	group?: string;
	breadcrumb?: Array<{
		// 没有breadcrumb：是根导航菜单下的可点击项
		name: string; // 仅有name：是导航菜单的组名
		path?: string; // 有path：可以点击跳转
		page?: string; // 有page：不是组名，是导航菜单可点击项
	}>;
}

const route = useRoute();
const navigateData = ref<Array<{ path?: string; page?: string; name: string }>>([]);
const dealPathInfo = (meta: RouterMeta) => {
	navigateData.value = [];

	navigateData.value.push(...(meta.breadcrumb || []), {
		name: route.meta.title as string,
		page: route.meta.page as string
	});
};

onMounted(() => {
	dealPathInfo(route.meta as unknown as RouterMeta);
});
watch(
	() => route.path,
	() => {
		dealPathInfo(route.meta as unknown as RouterMeta);
	}
);
const isHideMenu = getMenuStatus();
const platform = getScreenSize();

</script>
