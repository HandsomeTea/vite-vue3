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
				meta: { title: '首页', page: 'index' },
				component: () => import('../views/homeView.vue')
			},
			{
				path: '/test',
				meta: {
					title: '测试',
					group: '测试组',
					page: 'test',
					breadcrumb: [{ name: '测试组' }]
				},
				component: () => import('../views/testView.vue')
			},
			{
				path: '/test/edit',
				meta: {
					title: '测试编辑',
					page: 'testEdit',
					breadcrumb: [{ name: '测试组' }, { name: '测试', path: '/test', page: 'test' }]
				},
				component: () => import('../views/testEdit.vue')
			},
			{
				path: '/chart',
				meta: {
					title: 'vueflow',
					group: '图表',
					page: 'chart-vueflow',
					breadcrumb: [{ name: '图表' }]
				},
				component: () => import('../views/chart/vueflow/pipelineView.vue')
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
