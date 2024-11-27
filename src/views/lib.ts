import router from '@/router';
import { computed } from 'vue';
import type { LocationQueryRaw } from 'vue-router';
import { useScreenStore, useMenuStatusStore, useLoginStore, useLanguageTypeStore } from '@/store';

/** 路由跳转 */
export const redirectTo = (path: string, query?: LocationQueryRaw): void => {
	if (path !== router.currentRoute.value.path) {
		router.push({
			path,
			query
		});
	}
};

/** 获取屏幕尺寸类型 */
export const getScreenSize = () => {
	const store = useScreenStore();

	return computed(() => store.screenType);
};

/** 获取左侧菜单展开状态 */
export const getMenuStatus = () => {
	const store = useMenuStatusStore();

	// 以计算属性的方式，简单的值获取可直接读取store的存储的值
	return computed(() => store.menuHidden);
};

/** 获取当前登录状态 */
export const getLoginStatus = () => {
	const store = useLoginStore();

	// 以getters的方式，需要复杂计算才能获取的值，计算过程放在getters里
	return computed(() => store.isLogin);
};

/** 获取当前登陆用户信息 */
export const getLoginUserInfo = () => {
	const store = useLoginStore();

	return computed(() => store.getUserInfo);
};

/** 获取当前界面语言类型 */
export const getLang = () => {
	const store = useLanguageTypeStore();

	return computed(() => store.language);
};

/** 封装左侧菜单展开/折叠操作 */
export const toogleMenu = {
	methods: {
		toogleMenu(status?: boolean) {
			const store = useMenuStatusStore();

			return store.toogleSideShrink(status);
		}
	}
};
