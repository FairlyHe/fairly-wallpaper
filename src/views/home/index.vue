<script>
export default {
    name: 'index'
}
</script>
<script setup>
import {ref, onMounted} from 'vue'
import {useMediaQuery, useStorage} from '@vueuse/core'
import {API_ALLCATEGORIES_GET} from '@/api/home';

const isMobile = useMediaQuery('(max-width: 768px)')
const defaultCurrent = useStorage('fox-wallpaper:defaultCurrent', ['6'])
const navList = ref([])

// 获取分类列表
const getAllcategories = async () => {
    try {
        const res = await API_ALLCATEGORIES_GET({
            c: 'WallPaper',
            a: 'getAllCategories'
        })
        // console.log('获取分类列表', res.data)
        navList.value = Array.isArray(Object.values(res.data)) ? Object.values(res.data) : []

        const savedCategory = defaultCurrent.value[0]
        const activeCategory = navList.value.find(
            item => String(item.id) === String(savedCategory)
        )
        const fallbackCategory = navList.value.find(item => String(item.id) === '6') || navList.value[0]

        if (!activeCategory && fallbackCategory) {
            defaultCurrent.value = [fallbackCategory.id]
            current.value = 1
        } else if (activeCategory) {
            defaultCurrent.value = [activeCategory.id]
        }

        await getAllcategoriesList(current.value)
    } catch (error) {
        console.error('获取分类列表失败', error)
        navList.value = []
    }
}

// 获取分类下 图片列表
const loading = ref(false)
const pageSize = ref(20) // 每页展示的数据条数
const total = ref(0) // 数据总数
const current = useStorage('fox-wallpaper:currentPage', 1) // 当前页数

const wallpaperList = ref([])

async function getAllcategoriesList(page = 1) {
    const normalizedPage = Math.max(1, Number.parseInt(page, 10) || 1)
    loading.value = true
    current.value = normalizedPage
    try {
        const res = await API_ALLCATEGORIES_GET({
            c: 'WallPaper',
            a: 'getAppsByCategory',
            cid: defaultCurrent.value[0],
            start: (normalizedPage - 1) * pageSize.value
        })
        // console.log('res', res)
        total.value = Number(res.total)
        wallpaperList.value = Array.isArray(res.data) ? res.data : []
    } catch (error) {
        wallpaperList.value = []
        total.value = 0
    } finally {
        loading.value = false
    }
}

const changeAllcategoriesList = page => getAllcategoriesList(page)

function handleClick(key) {
    defaultCurrent.value = [key]
    getAllcategoriesList(1)
}

const imageVisible = ref(false)
const imageDetails = ref({
    utag: '',
})
const resolution = ref([
    {key: 'img_1024_768', value: '1024*768'},
    {key: 'img_1280_800', value: '1280*800'},
    {key: 'img_1280_1024', value: '1280*1024'},
    {key: 'img_1366_768', value: '1366*768'},
    {key: 'img_1440_900', value: '1440*900'},
    {key: 'img_1600_900', value: '1600*900'}
])

function handleResolutionClick(item) {
    const url = imageDetails.value?.[item.key]
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const downloadBtnLoading = ref(false)

async function handleDownload(row) {
    if (!row?.url) return
    downloadBtnLoading.value = true
    try {
        const response = await fetch(row.url)
        if (!response.ok) throw new Error(`download failed: ${response.status}`)
        const blob = await response.blob()
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `image-${row.url.split('/').pop()?.split('?')[0] || 'wallpaper'}`
        link.click()
        setTimeout(() => URL.revokeObjectURL(link.href), 0)
    } catch (error) {
        window.open(row.url, '_blank', 'noopener,noreferrer')
    } finally {
        downloadBtnLoading.value = false
    }
}


onMounted(() => {
    // getData()
    getAllcategories()
})

</script>

<template>
    <div class="home-page">
        <aside class="category-nav">
            <a-scrollbar class="category-scroll">
                <div class="category-menu-shell">
                    <a-menu
                        class="category-menu"
                        :mode="isMobile ? 'horizontal' : 'vertical'"
                        :style="{ 'text-align': 'center' }"
                        :selected-keys="defaultCurrent"
                        @menu-item-click="handleClick"
                    >
                        <a-menu-item v-for="item in navList" :key="item.id">{{ item.name }}</a-menu-item>
                    </a-menu>
                </div>
            </a-scrollbar>
        </aside>
        <section class="wallpaper-main">
            <div class="wallpaper-list">
                <a-scrollbar class="wallpaper-scroll">
                    <a-spin class="wallpaper-spin" :loading="loading" tip="努力插入中...">
                        <div class="empty-state" flex="main:center cross:center" v-if="wallpaperList.length === 0">
                            <a-result status="404" title="暂时没有壁纸" subtitle="请查看其它分类吧！"></a-result>
                        </div>
                        <a-grid :cols="{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }" :colGap="12" :rowGap="16"
                                class="grid-demo-grid" v-else>
                            <a-grid-item class="demo-item" v-for="item in wallpaperList" :key="item.id">
                                <a-image
                                    width="100%"
                                    height="100%"
                                    fit="cover"
                                    :src="item.url_thumb"
                                    :preview="false"
                                    @click="imageVisible = true; imageDetails = item"
                                >
                                    <template #loader>
                                        <div class="loader-animate"/>
                                    </template>
                                </a-image>
                            </a-grid-item>
                        </a-grid>
                    </a-spin>
                </a-scrollbar>
            </div>
            <div class="pagination-bar">
                <div>
                    <a-pagination :total="total" :current="current" :page-size="pageSize"
                                  :size="isMobile ? 'small' : 'medium'"
                                  :simple="isMobile"
                                  @change="changeAllcategoriesList"/>
                </div>
            </div>
        </section>
    </div>


    <a-modal
        v-model:visible="imageVisible"
        class="wallpaper-modal"
        :width="isMobile ? '94vw' : '80vw'"
        :hide-title="true"
        :hideCancel="true"
        okText="关闭"
        @onOk="imageVisible = false; imageDetails = {}"
    >
        <div class="image-detail">
            <div class="image-preview">
                <a-image
                    class="detail-image"
                    width="100%"
                    :src="imageDetails.url"
                    show-loader
                    :preview="false"
                >
                </a-image>
            </div>
            <div class="detail-panel">
                    <div class="detail-section">
                        <p class="f-mb-5">标签：</p>
                        <a-space wrap>
                            <a-tag
                                v-for="i in (imageDetails.utag || '').split(' ').filter(Boolean)"
                                :key="i">
                                {{ i }}
                            </a-tag>
                        </a-space>
                    </div>
                    <div class="detail-section resolution-section">
                        <p class="f-mb-5">分辨率：</p>
                        <a-space wrap>
                            <a-tag
                                v-for="r in resolution"
                                :key="r.key" checkable
                                @check="handleResolutionClick(r)">
                                {{ r.value }}
                            </a-tag>
                        </a-space>
                    </div>
                    <div class="download-action">
                        <a-button
                            class="download-button"
                            type="primary"
                            size="small"
                            :loading="downloadBtnLoading"
                            @click="handleDownload(imageDetails)">
                            下载
                        </a-button>
                    </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped lang="less">
.home-page {
    display: flex;
    height: 100%;
    min-width: 0;
}

.category-nav {
    flex: 0 0 200px;
    width: 200px;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--color-border-2);
}

:deep(.category-scroll),
:deep(.wallpaper-scroll) {
    display: block;
    width: 100%;
    height: 100%;
}

:deep(.category-nav > .arco-scrollbar) {
    display: block;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

:deep(.category-scroll) {
    min-height: 0;
    overflow-x: hidden !important;
    overflow-y: auto !important;
}

:deep(.wallpaper-scroll) {
    min-height: 0;
    overflow-x: hidden !important;
    overflow-y: auto !important;
}

.category-menu-shell {
    width: 200px;
    min-height: 100%;
}

.wallpaper-main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.wallpaper-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
}

:deep(.wallpaper-list > .arco-scrollbar) {
    display: block;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

.grid-demo-grid {
    padding: 12px;
}

.demo-item {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: 6px;
    cursor: pointer;
}

.pagination-bar {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding: 8px 12px;
    border-top: 1px solid var(--color-border-2);
}

:deep(.wallpaper-spin) {
    display: block;
    width: 100%;
}

.loader-animate {
    width: 100%;
    height: 100%;
    background: linear-gradient(-60deg,
    var(--color-fill-2) 25%,
    var(--color-neutral-3) 40%,
    var(--color-fill-3) 55%);
    background-size: 400% 100%;
    animation: loop-circle 1.5s cubic-bezier(0.34, 0.69, 0.1, 1) infinite;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 150px);
}

.image-detail {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(220px, 1fr);
    gap: 20px;
    align-items: stretch;
}

.image-preview {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--color-fill-1);
}

:deep(.detail-image .arco-image-img) {
    display: block;
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
}

.detail-panel {
    display: flex;
    min-width: 0;
    flex-direction: column;
}

.detail-section p {
    color: var(--color-text-2);
    font-weight: 600;
}

.resolution-section {
    flex: 1 1 auto;
}

.download-action {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
}

@media (max-width: 768px) {
    .home-page {
        flex-direction: column;
    }

    .category-nav {
        flex: 0 0 48px;
        width: 100%;
        height: 48px;
        overflow: hidden;
        border-right: 0;
        border-bottom: 1px solid var(--color-border-2);
    }

    :deep(.category-scroll) {
        height: 48px;
    }

    :deep(.category-scroll) {
        max-width: 100%;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        overscroll-behavior-x: contain;
    }

    .category-menu-shell {
        width: max-content;
        min-width: 100%;
        min-height: 48px;
    }

    :deep(.category-menu) {
        width: max-content;
        min-width: 100%;
    }

    .grid-demo-grid {
        padding: 8px;
    }

    .pagination-bar {
        min-height: 44px;
        padding: 6px 8px;
    }

    .empty-state {
        min-height: calc(100vh - 210px);
    }

    .image-detail {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
    }

    .image-preview {
        max-height: 44vh;
    }

    :deep(.detail-image .arco-image-img) {
        max-height: 44vh;
    }

    .detail-panel {
        max-height: 34vh;
        overflow-y: auto;
    }

    .download-action {
        position: sticky;
        bottom: 0;
        margin-top: 20px;
        padding-top: 12px;
        background: var(--color-bg-3);
    }

    .download-button {
        width: 100%;
    }

    .wallpaper-modal :deep(.arco-modal-body) {
        max-height: 78vh;
        padding: 12px;
        overflow-y: auto;
    }
}
</style>
