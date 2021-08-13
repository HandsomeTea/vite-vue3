<template>
    <el-container>
        <el-aside :width="isHideMenu ? '64px' : '220px'">
            <Logo />
            <Menu />
        </el-aside>
        <el-container>
            <el-header height="50px">
                <Header />
            </el-header>
            <el-main class="root_main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { getMenuStatus } from '@/views/lib';

export default defineComponent({
    components: {
        Menu: defineAsyncComponent(() => import('./menu.vue')),
        Logo: defineAsyncComponent(() => import('./logo.vue')),
        Header: defineAsyncComponent(() => import('./header/index.vue'))
    },
    setup() {
        return {
            isHideMenu: getMenuStatus()
        };
    }
});
</script>

<style lang="less">
@system_background_color: #fbfbfb;

#app {
    width: 100%;
    height: 100%;

    .el-container {
        width: 100%;
        height: 100%;
        background-color: @system_background_color;
        color: #666;
    }
}
.el-header {
    background-color: #fff;
    border-bottom: solid 1px #e6e6e6;
    padding: 0;
}

.el-aside {
    background-color: rgb(22, 24, 29);
    border-right: solid 1px #e6e6e6;
    overflow: hidden;
}

.root_main {
    background-color: @system_background_color;
    padding: 0;
    margin: 0;
    overflow: auto;
    border-radius: 0;
    box-shadow: none;
}
</style>
