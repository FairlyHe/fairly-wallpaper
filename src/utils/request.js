import axios from 'axios';
import QS from 'qs';
import { Message, Modal } from '@arco-design/web-vue';
import util from "@/utils/util.js";


const service = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    withCredentials: true,
    timeout: 1000 * 5,
})

// 请求拦截
service.interceptors.request.use(
    async config => {
        config.headers.token = util.cookies.get('token')
        return config
    },
    error => {
        return Promise.error(error)
    }
);
// 响应拦截
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    break
                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    // sessionStorage.clear()
                    // router.push('/login')
                    break
                // 404请求不存在
                case 404:
                    break;
                // 其他错误，直接抛出错误提示
                default:
            }
            return Promise.reject(error.response);
        }
    }
);

export default service;
