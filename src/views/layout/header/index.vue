<template>
    <div>
        <Title></Title>
        <Options></Options>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

export default defineComponent({
    components: {
        Title: defineAsyncComponent(() => import('./headerBreadcrumb.vue')),
        Options: defineAsyncComponent(() => import('./headerOption.vue'))
    }
});
</script>

<style lang="less" scoped></style>
