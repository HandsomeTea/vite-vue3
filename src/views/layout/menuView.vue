<template>
	<a-menu
		theme="dark"
		:default-selected-keys="[`/${$route.path.split('/')[1]}`]"
		:collapsed="isHideMenu"
		class="layout_menu"
	>
		<a-menu-item key="/index" @click="redirectTo('/index')">
			<template #icon>
				<icon-home />
			</template>
			首页
		</a-menu-item>

		<a-sub-menu key="/test">
			<template #icon>
				<icon-download />
			</template>
			<template #title> 测试组 </template>
			<a-menu-item key="/test" @click="redirectTo('/test')"> 测试 </a-menu-item>
		</a-sub-menu>
	</a-menu>
</template>

<script setup lang="ts">
import { redirectTo, getMenuStatus } from '@/views/lib';

const isHideMenu = getMenuStatus();

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
