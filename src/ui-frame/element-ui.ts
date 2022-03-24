import { App } from 'vue';
import {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapseTransition,
    ElIcon
} from 'element-plus';
import {
    Location,
    Fold,
    Expand
} from '@element-plus/icons-vue';

// 基础样式
import 'element-plus/theme-chalk/base.css';

// 组件样式配置了按需引入
import 'element-plus/theme-chalk/el-container.css';
import 'element-plus/theme-chalk/el-header.css';
import 'element-plus/theme-chalk/el-aside.css';
import 'element-plus/theme-chalk/el-main.css';
import 'element-plus/theme-chalk/el-menu.css';
import 'element-plus/theme-chalk/el-sub-menu.css';
import 'element-plus/theme-chalk/el-menu-item-group.css';
import 'element-plus/theme-chalk/el-breadcrumb.css';
import 'element-plus/theme-chalk/el-breadcrumb-item.css';
import 'element-plus/theme-chalk/el-collapse-transition.css';

export default (app: App<Element>) => {
    app.use(ElContainer);
    app.use(ElHeader);
    app.use(ElAside);
    app.use(ElMain);
    app.use(ElMenu);
    app.use(ElSubMenu);
    app.use(ElMenuItem);
    app.use(ElMenuItemGroup);
    app.use(ElBreadcrumb);
    app.use(ElBreadcrumbItem);
    app.use(ElCollapseTransition);
    // 图标
    app.use(ElIcon);
    app.component('Location', Location);
    app.component('Fold', Fold);
    app.component('Expand', Expand);
};
