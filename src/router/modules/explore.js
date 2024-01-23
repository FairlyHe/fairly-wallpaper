import layout from '@/layout/layout.vue'

const meta = { auth: true }

export default {
    path: '/explore',
    name: 'explore',
    meta,
    redirect: { name: 'explore-index' },
    component: layout,
    children: [
        { path: 'index', name: 'explore-index', component: () => import('@/views/explore/index.vue'), meta: { ...meta, title: '发现' } },
    ]
}
