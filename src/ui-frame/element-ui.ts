import {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElSubmenu,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapseTransition
} from 'element-plus';

// 文字图标
import 'element-plus/lib/theme-chalk/el-icon.css';
// 组件样式配置了按需引入，但是element-plus的全局样式变量似乎并没有按需引入进去，所以做了单独引入
import 'element-plus/lib/theme-chalk/base.css';


export default [
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElSubmenu,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapseTransition
];
