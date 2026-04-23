<template>
	<div v-if="$route.path === '/test'">
		<a-button @click="redirectTo('/test/edit')"> 编辑 </a-button>
	</div>
	<router-view v-else />
</template>
<script setup lang="ts">
import { redirectTo } from '@/views/lib';
</script>
