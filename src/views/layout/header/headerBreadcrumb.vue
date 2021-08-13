<template>
    <ul :class="['head_title', { side_shift_title: isHideMenu === true }]">
        <li class="item side_move" @click="toogleMenu()">
            <i class="el-icon-s-fold toogle_menu_icon" v-show="!isHideMenu"></i>
            <i class="el-icon-s-unfold toogle_menu_icon" v-show="isHideMenu"></i>
        </li>

        <li class="item">
            <el-breadcrumb separator="/" class="route_path">
                <el-breadcrumb-item v-if="(isHideMenu && platform === 'phone') || platform !== 'phone'"> 首页 </el-breadcrumb-item>
                <el-breadcrumb-item v-if="(isHideMenu && platform === 'phone') || platform !== 'phone'"> 活动管理 </el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getMenuStatus, getScreenSize, toogleMenu } from '@/views/lib';

export default defineComponent({
    mixins: [toogleMenu],
    setup() {
        return {
            isHideMenu: getMenuStatus(),
            platform: getScreenSize()
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
