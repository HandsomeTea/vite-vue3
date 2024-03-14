import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from '@/lang';
import { ElementPlusComponents, VantComponents, NaiveComponents } from '@/ui-frame';
import '@/assets';

const app = createApp(App)
	.use(store)
	.use(router)
	.use(i18n);

ElementPlusComponents(app);
VantComponents(app);
NaiveComponents(app);

app.mount('#app');
