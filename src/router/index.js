import {createRouter, createWebHistory} from 'vue-router'

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import util from '@/utils/util.js'

// 路由数据
import appRoutes from './routes'

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: appRoutes
})
router.beforeEach(async (to, from, next) => {
    // 进度条
    NProgress.start()
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
        const token = util.cookies.get('token')
        if (token && token !== 'undefined') {
            next()
        } else {
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
            NProgress.done()
        }
    } else {
        // 不需要身份校验 直接通过
        next()
    }
})

router.afterEach((to, from) => {
    // 进度条
    NProgress.done()
    // 更改标题
    util.title(to.meta.title)
})

export default router
