import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext, NavigationFailure, isNavigationFailure, createWebHashHistory } from 'vue-router';

const homeModule = import.meta.glob('../views/*.vue');
const layoutModule = import.meta.glob('../views/layout/*.vue');
const routes: Array<RouteRecordRaw> = [{
    path: '/',
    redirect: '/index',
    component: layoutModule['../views/layout/index.vue'],
    children: [{
        path: '/index',
        component: homeModule['../views/home.vue']
    }]
}];
const env = import.meta.env;
const router = createRouter({
    history: process.env.NODE_ENV === 'development' ? createWebHashHistory(env.BASE_URL) : createWebHistory(env.BASE_URL),
    routes
});


/**
 * 全局导航守卫
 */

/* 前置导航守卫 */
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // do something before next route
    next();
});

/* 后置导航守卫 */
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure | void) => {
    if (isNavigationFailure(failure)) {
        // eslint-disable-next-line no-console
        console.log('failed navigation', failure);
    }
});

export default router;
