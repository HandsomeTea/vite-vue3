import { App } from 'vue';
import {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElSubmenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapseTransition
} from 'element-plus';
// 基础样式
import 'element-plus/lib/theme-chalk/base.css';
// 组件样式配置了按需引入
// 文字图标
import 'element-plus/lib/theme-chalk/el-icon.css';

export default (app: App<Element>) => {
    app.use(ElContainer);
    app.use(ElHeader);
    app.use(ElAside);
    app.use(ElMain);
    app.use(ElMenu);
    app.use(ElSubmenu);
    app.use(ElMenuItem);
    app.use(ElMenuItemGroup);
    app.use(ElBreadcrumb);
    app.use(ElBreadcrumbItem);
    app.use(ElCollapseTransition);
};
