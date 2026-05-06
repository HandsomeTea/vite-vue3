<template>
	<a-menu theme="dark" breakpoint="xl" v-model:selected-keys="activeMenu"
		:default-selected-keys="[`/${$route.path.split('/')[1]}`]" :collapsed="isHideMenu" show-collapse-button
		auto-open-selected class="layout_menu" @collapse="toogleMenu" @menu-item-click="changeRoute">
		<a-menu-item key="index">
			<template #icon>
				<icon-home />
			</template>
			首页
		</a-menu-item>

		<a-sub-menu>
			<template #icon>
				<icon-download />
			</template>
			<template #title> 测试组 </template>
			<a-menu-item key="test"> 测试 </a-menu-item>
		</a-sub-menu>
	</a-menu>
</template>

<script setup lang="ts">
import { getMenuStatus, redirectTo, toogleMenu } from '@/views/lib';
import { ref, watch } from 'vue';
import router from '@/router';

const isHideMenu = getMenuStatus();
const activeMenu = ref([router.currentRoute.value.matched[1]?.meta.page]);

watch(() => router.currentRoute.value, () => {
	activeMenu.value = [router.currentRoute.value.matched[1]?.meta.page];
}, { immediate: true, deep: true });

const changeRoute = (page: string) => {
	const route = router.getRoutes().find(a => a.meta.page === page);

	if (route) {
		redirectTo(route.path);
	}
};

</script>

<style lang="less" scoped>
.layout_menu {
	overflow: hidden;
	height: calc(100% - @layout_head_height) !important;
	border-right-color: #16181d;
}

.layout_menu:hover {
	overflow-y: auto;
}

.layout_menu::-webkit-scrollbar {
	width: 4px;
}

.layout_menu::-webkit-scrollbar-thumb {
	background: @theme_color;
}

.layout_menu::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0);
	box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
}
</style>
