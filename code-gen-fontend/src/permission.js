import {
    getMenuNavList
} from '@/api/sys-management/menu-management'
import {
    getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import router from '@/router'
import {
    resetRouter
} from '@/router'
import store from '@/store'

import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/home/index'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    /* //TODO:FIXME:暂不使用权限 */
    const accessRoutes = await store.dispatch('permission/generateRoutes', { menuList: [],permissions:[] });
    resetRouter();
    router.addRoutes(accessRoutes);
    next();
    NProgress.done();
    return;
    /* //TODO:FIXME:暂不使用权限 */

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            try {
                const res = await getMenuNavList();
                console.log('===============', res)
                if (res.code === 0) {
                    console.log('kkkkk===', from, to)
                    const accessRoutes = await store.dispatch('permission/generateRoutes', res);
                    resetRouter();
                    router.addRoutes(accessRoutes);
                    if (sessionStorage.getItem('REFRESH_ACTION')) {
                        //console.log(1111111, '动态路由刷新的时候进入这里')
                        sessionStorage.removeItem('REFRESH_ACTION');
                        next({
                            path: to.path,
                            query: to.query,
                            params: to.params,
                            meta: to.meta
                        });
                    } else if (to.path.indexOf('/default') !== -1) {
                        //console.log(222222, '尚未做的页面路由进入这里')
                        next(false)
                    } else {
                        //console.log(333333, to, from);
                        if (sessionStorage.getItem('BACK_ACTION')) {
                            //console.log('后退触发');
                            sessionStorage.removeItem('BACK_ACTION')
                            next({
                                path: from.path,
                                query: from.query,
                                params: from.params,
                                meta: from.meta
                            });
                        } else {
                            //console.log('正常的进入这里', from, to);
                            next()
                        }
                    }
                }
            } catch (error) {
                await store.dispatch('user/resetToken')
                Message.error(error || 'Has Error')
                next(`/login?redirect=${to.path}`)
                NProgress.done()
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})