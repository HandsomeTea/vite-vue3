import router from '@/router';
import { RootState, UserState } from '@/store/stateModel';
import { computed, ComputedRef } from 'vue';
import { LocationQueryRaw } from 'vue-router';
import { Store, useStore } from 'vuex';

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
export const getScreenSize = (): ComputedRef<'phone' | 'ipad' | 'spc' | 'pc'> => {
	const store: Store<RootState> = useStore();

	return computed(() => store.state.screenType);
};

/** 获取左侧菜单展开状态 */
export const getMenuStatus = (): ComputedRef<boolean> => {
	const store: Store<RootState> = useStore();

	// 以计算属性的方式，简单的值获取可直接读取store的存储的值
	return computed(() => store.state.menuHidden);
};

/** 获取当前登录状态 */
export const getLoginStatus = (): ComputedRef<boolean> => {
	const store: Store<RootState> = useStore();

	// 以getters的方式，需要复杂计算才能获取的值，计算过程放在getters里
	return computed(() => store.getters.loginStatus);
};

/** 获取当前登陆用户信息 */
export const getLoginUserInfo = (): ComputedRef<UserState> => {
	const store: Store<RootState> = useStore();

	return computed(() => store.state.user);
};

/** 获取当前界面语言类型 */
export const getLang = (): ComputedRef<SupportLanguageType> => {
	const store: Store<RootState> = useStore();

	return computed(() => store.state.language);
};

/** 封装左侧菜单展开/折叠操作 */
export const toogleMenu = {
	methods: {
		async toogleMenu(status?: boolean): Promise<void> {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			return await this.$store.dispatch('toogleSideShrink', status);
		}
	}
};
