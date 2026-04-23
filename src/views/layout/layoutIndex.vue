<template>
	<a-row class="app-container">
		<a-col :flex="isHideMenu ? '48px' : '220px'" class="app-aside">
			<Logo />
			<Navigation />
		</a-col>
		<a-col flex="auto" class="app-content">
			<div class="app-header">
				<page-header />
			</div>
			<div class="root_main">
				<router-view />
			</div>
		</a-col>
	</a-row>
</template>

<script setup lang="ts">
import { getMenuStatus } from '@/views/lib';
import Navigation from './menuView.vue';
import Logo from './logoView.vue';
import pageHeader from './header/headerIndex.vue';

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

.app-header {
	height: 50px;
	background-color: #fff;
	border-bottom: solid 1px #e6e6e6;
	padding: 0;
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
</style>
