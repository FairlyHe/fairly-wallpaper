import request from '@/utils/request';

export function SYS_USER_LOGIN(data) {
    return request({
        url: '/admin/login',
        method: 'post',
        data,
    });
}

export function API_BANNER_GET(params) {
    return request({
        url: '/banner',
        method: 'get',
        params,
    });
}
export function API_PERSONALIZED_GET(params) {
    return request({
        url: '/personalized',
        method: 'get',
        params,
    });
}
export function API_ALLCATEGORIES_GET(params) {
    return request({
        // Vite's local proxy keeps the original endpoint; Vercel uses the
        // serverless function so the upstream URL is never exposed publicly.
        url: import.meta.env.DEV ? '/index.php' : '/api/wallpaper',
        method: 'get',
        params,
    });
}
