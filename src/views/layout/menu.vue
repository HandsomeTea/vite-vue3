<template>
	<el-collapse-transition>
		<el-menu
			:default-active="`/${$route.path.split('/')[1]}`"
			:collapse="isHideMenu"
			class="layout_menu"
			background-color="#16181D"
			text-color="rgba(255,255,255,.7)"
			active-text-color="#409EFF"
		>
			<el-menu-item index="/index" @click="redirectTo('/index')">
				<el-icon>
					<location />
				</el-icon>
				<span>首页</span>
			</el-menu-item>

			<el-sub-menu index="/test">
				<template #title>
					<el-icon>
						<location />
					</el-icon>
					<span>测试组</span>
				</template>
				<el-menu-item index="/test" @click="redirectTo('/test')">
					<el-icon>
						<location />
					</el-icon>
					<span>测试</span>
				</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</el-collapse-transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { redirectTo, getMenuStatus } from '@/views/lib';
export default defineComponent({
	setup() {
		return {
			isHideMenu: getMenuStatus(),
			redirectTo
		};
	}
});
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
