<template>
	<div class="layout_menu_header">
		<img src="../../assets/image/logo.png">
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="less" scoped>
.layout_menu_header {
	height: calc(@layout_head_height - 1px);
	color: #fff;
	border-bottom: solid 1px @menu_background_color;
	background-color: rgba(255, 255, 255, 0.1);
}
</style>
