import { App } from 'vue';
import {
    Button,
    Icon
} from 'vant';

// 基础样式
import 'vant/lib/index.css';

// 组件样式配置了按需引入
import 'vant/lib/button/index.css';

export default (app: App<Element>) => {
    app.use(Button);
    app.use(Icon);
};
