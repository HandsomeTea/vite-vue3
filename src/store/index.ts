import { createPinia } from 'pinia';

export { useLanguageTypeStore, useMenuStatusStore, useScreenStore } from './view';
export { useLoginStore } from './account';
export const store = createPinia();
