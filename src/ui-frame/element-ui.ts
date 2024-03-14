import { App } from 'vue';
import {
	Location,
	Fold,
	Expand
} from '@element-plus/icons-vue';

export default (app: App<Element>) => {
	app.component('Location', Location);
	app.component('Fold', Fold);
	app.component('Expand', Expand);
};
