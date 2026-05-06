import { createRouter, createWebHashHistory, createWebHistory, isNavigationFailure } from 'vue-router';
import type {
	NavigationFailure,
	RouteLocationNormalized,
	RouteLocationNormalizedLoaded,
	RouteRecordRaw
} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/index',
		component: () => import('../views/layout/layoutView.vue'),
		children: [
			{
				path: '/index',
				meta: { i18nNavigateName: '首页', page: 'index' },
				component: () => import('../views/homeView.vue')
			},
			{
				path: '/test',
				meta: { i18nNavigateName: '测试', i18nNavigateGroupName: '测试组', page: 'test' },
				component: () => import('../views/testView.vue'),
				children: [
					{
						path: '/test/edit',
						meta: { i18nNavigateName: '测试编辑', page: 'testEdit' },
						component: () => import('../views/testEdit.vue')
					}
				]
			}
		]
	}
];
const router = createRouter({
	history:
		import.meta.env.NODE_ENV === 'development'
			? createWebHashHistory(import.meta.env.BASE_URL)
			: createWebHistory(import.meta.env.BASE_URL),
	routes
});

/**
 * 全局导航守卫
 */

/* 前置导航守卫 */
router.beforeEach((_to: RouteLocationNormalized, _from: RouteLocationNormalizedLoaded) => {
	return true;
});

/* 后置导航守卫 */
router.afterEach(
	(_to: RouteLocationNormalizedLoaded, _from: RouteLocationNormalizedLoaded, failure?: NavigationFailure | void) => {
		if (isNavigationFailure(failure)) {
			// eslint-disable-next-line no-console
			console.log('failed navigation', failure);
		}
	}
);

export default router;
