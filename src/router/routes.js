import layout from '@/layout/layout.vue'
const modules = import.meta.glob('./modules/*.js', { eager: true });

let result = []
function formatModules(_modules) {
    Object.keys(_modules).forEach((key) => {
        const defaultModule = _modules[key].default;
        if (!defaultModule) return;
        const moduleList = Array.isArray(defaultModule)
            ? [...defaultModule]
            : [defaultModule];
        result.push(...moduleList);
    })
    return result;
}
result = formatModules(modules);

// 在主框架内显示
const frameIn = [
    {
        path: '/',
        redirect: { name: 'index' },
        component: layout,
        children: [
            {
                path: 'index',
                name: 'index',
                meta: {
                    title: '首页',
                    auth: false
                },
                component: () => import('@/views/home/index.vue')
            },
        ]
    },
    // ...result
]

// 在主框架之外显示
const frameOut = [

]

export default [
    ...frameIn,
    ...frameOut
]
