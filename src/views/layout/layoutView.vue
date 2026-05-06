<template>
	<a-row class="app-container">
		<a-col :flex="isHideMenu ? '48px' : '220px'" class="app-aside">
			<Logo />
			<Navigation />
		</a-col>
		<a-col flex="auto" class="app-content">
			<page-header />
			<div
				class="view-main p-0 my-[16px] mx-[20px] w-[calc(100%-40px)] max-h-[calc(100%-77px)] overflow-auto rounded-[6px]">
				<router-view />
			</div>
		</a-col>
	</a-row>
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
	height: 100%;
}

.view-main {
	background-color: #fff;
	box-shadow: 0 4px 6px 0px rgba(0, 0, 0, 0.1), 0px -1px 6px -2px rgba(0, 0, 0, 0.1);
}
</style>
