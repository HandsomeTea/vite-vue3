import { App } from 'vue';
import {
    Button,
    Icon
} from 'vant';

// 组件样式配置了按需引入

export default (app: App<Element>) => {
    app.use(Button);
    app.use(Icon);
};
