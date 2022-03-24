<template>
    <ul :class="['head_title', { side_shift_title: isHideMenu === true }]">
        <li class="item side_move" @click="toogleMenu()">
            <el-icon class="toogle_menu_icon">
                <fold style="height: 20px; width: 20px" v-show="!isHideMenu" />
                <expand style="height: 20px; width: 20px" v-show="isHideMenu" />
            </el-icon>
        </li>

        <li class="item">
            <el-breadcrumb separator="/" class="route_path">
                <template v-for="(navigate, i) in navigateData">
                    <el-breadcrumb-item
                        :key="i + '1'"
                        v-if="i <= 1 && ((isHideMenu && platform === 'phone') || platform !== 'phone')"
                        :to="navigate.path && navigate.path !== $route.path ? { path: navigate.path } : null"
                    >
                        {{ $t(navigate.nameI18n) }}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item :key="i + '2'" v-if="i > 1"> {{ $t(navigate.nameI18n) }}</el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { getMenuStatus, getScreenSize, toogleMenu } from '@/views/lib';
import { RouteLocationMatched, useRoute } from 'vue-router';

export default defineComponent({
    mixins: [toogleMenu],
    setup() {
        const route = useRoute();
        const navigateData: Ref<Array<{ path?: string, nameI18n: string }>> = ref([]);
        const dealPathInfo = (matchedInfo: Array<RouteLocationMatched>) => {
            navigateData.value = [];
            matchedInfo.map(a => {
                if (a.path !== '/') {
                    if (typeof a.meta.i18nNavigateGroupName === 'string') {
                        navigateData.value.push({
                            nameI18n: a.meta.i18nNavigateGroupName
                        });
                    }
                    navigateData.value.push({
                        path: a.path,
                        nameI18n: a.meta.i18nNavigateName as string || 'vite app'
                    });
                }
            });
        };

        dealPathInfo(route.matched);
        watch(() => route.path, () => {
            dealPathInfo(route.matched);
        });

        return {
            isHideMenu: getMenuStatus(),
            platform: getScreenSize(),
            navigateData
        };
    }
});
</script>

<style lang="less" scoped>
.head_title {
    left: @layout_menu_width_big;
    height: @layout_head_height;
    overflow: hidden;
}

.item {
    height: @layout_head_height;
    line-height: @layout_head_height;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
    margin-left: 10px;
}

.side_shift_title {
    left: @layout_menu_width_small;
}

.side_move {
    margin-left: 12px;
    margin-right: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    .cp();
}

.toogle_menu_icon {
    color: rgba(0, 0, 0, 0.45);
    font-size: 24px;
    margin-top: 8px;
}

.route_path {
    margin-top: 18px;
}
</style>
