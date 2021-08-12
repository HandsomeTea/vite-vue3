import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './lang';
import { ElementPlusComponents, VantComponents } from './ui-frame';
import './assets';

const app = createApp(App)
    .use(store)
    .use(router)
    .use(i18n);

[...VantComponents, ...ElementPlusComponents].forEach(component => {
    app.use(component);
});

app.mount('#app');
