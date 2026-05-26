<template>
	<div class="app-container">
		<div :style="{ width: isHideMenu ? '48px' : '220px' }" class="app-aside float-left">
			<Logo />
			<Navigation />
		</div>
		<div
			:style="{ width: isHideMenu ? 'calc(100% - 49px)' : 'calc(100% - 221px)' }"
			class="app-content float-left h-full"
		>
			<page-header />

			<div class="overflow-auto p-[16px] w-[calc(100%-32px)] h-[calc(100%-77px)]">
				<div class="app-main p-[10px] w-[calc(100%-20px)] rounded-[6px]">
					<router-view />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getMenuStatus } from '@/views/lib';
import Navigation from './menuView.vue';
import Logo from './logoView.vue';
import pageHeader from './header/headerView.vue';

const isHideMenu = getMenuStatus();
</script>

<style lang="less">
@system_background_color: #fbfbfb;

#app {
	width: 100%;
	height: 100%;

	.app-container {
		width: 100%;
		height: 100%;
		background-color: @system_background_color;
		color: #666;
	}
}

.app-aside {
	background-color: rgb(22, 24, 29);
	border-right: solid 1px #e6e6e6;
	overflow: hidden;
	height: 100%;
}

.app-content {
	background-color: @system_background_color;
	padding: 0;
	margin: 0;
	overflow: auto;
	border-radius: 0;
	box-shadow: none;
}

.app-main {
	background-color: #fff;
	box-shadow:
		0 4px 6px 0px rgba(0, 0, 0, 0.1),
		0px -1px 6px -2px rgba(0, 0, 0, 0.1);
}
</style>
