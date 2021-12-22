<template>
    <el-main v-if="$route.path === '/test'"> <n-button type="info" @click="redirectTo('/test/edit')">编辑</n-button></el-main>
    <router-view v-else />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { redirectTo } from '@/views/lib';

export default defineComponent({
    setup() {
        return {
            redirectTo
        };
    }
});
</script>
