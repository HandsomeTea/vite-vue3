import { type App } from 'vue';
import '@arco-design/web-vue/dist/arco.css';
import { IconDownload } from '@arco-design/web-vue/es/icon';

export default (app: App<Element>): void => {
	app.use(IconDownload);
};
