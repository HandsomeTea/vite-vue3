<template>
	<a-page-header id="appHeader" class="bg-white shadow-sm app-header" @back="() => $router.back()">
		<template #title>
			<breadcrumb />
		</template>
		<template #subtitle>
			模型转换
		</template>
		<template #extra>
			<avatar />
		</template>
	</a-page-header>
</template>

<script setup lang="ts">
import breadcrumb from './headerBreadcrumb.vue';
import avatar from './headerAvatar.vue';
</script>

<style lang="less">
.app-header {
	height: 44px;
	background-color: #fff;
	border-bottom: solid 1px #e6e6e6;
	padding: 0;
}

#appHeader {
	.arco-breadcrumb {
		display: flex;
	}

	.arco-page-header-wrapper {
		padding-top: 6px;
	}
}
</style>
