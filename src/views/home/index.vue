<script>
export default {
    name: 'index'
}
</script>
<script setup>
import {ref, onMounted} from 'vue'
import {useStorage} from '@vueuse/core'
import {API_ALLCATEGORIES_GET} from '@/api/home';

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
    <div flex style="height: 100%" class="aaa">
        <div flex-box="0" class="leftNav">
            <a-scrollbar style="height: 100%; overflow: auto">
                <div style="height: 100vh;width: 200px;">
                    <a-menu
                        mode="vertical"
                        :style="{ 'text-align': 'center' }"
                        :selected-keys="defaultCurrent"
                        @menu-item-click="handleClick"
                    >
                        <a-menu-item v-for="item in navList" :key="item.id">{{ item.name }}</a-menu-item>
                    </a-menu>
                </div>
            </a-scrollbar>
        </div>
        <div flex-box="1" flex="dir:top">
            <div flex-box="1" class="aaaaa" style="height: 100%; overflow: auto;">
                <a-scrollbar style="height: 100%; overflow: auto">
                    <a-spin class="wallpaper-spin" :loading="loading" tip="努力插入中...">
                        <div class="empty-state" flex="main:center cross:center" v-if="wallpaperList.length === 0">
                            <a-result status="404" title="暂时没有壁纸" subtitle="请查看其它分类吧！"></a-result>
                        </div>
                        <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5  }" :colGap="12" :rowGap="16"
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
            <div class="f-text-center f-mt-10 f-mb-10" flex-box="0">
                <div style="display: inline-block">
                    <a-pagination :total="total" :current="current" :page-size="pageSize" @change="changeAllcategoriesList"/>
                </div>
            </div>
        </div>
    </div>


    <a-modal
        v-model:visible="imageVisible"
        width="80vw"
        :hide-title="true"
        :hideCancel="true"
        okText="关闭"
        @onOk="imageVisible = false; imageDetails = {}"
    >
        <a-row class="grid-demo" :gutter="12" flex style="align-items: initial">
            <a-col :span="18" flex-box="1">
                <a-image
                    width="100%"
                    :src="imageDetails.url"
                    show-loader
                    :preview="false"
                >
                </a-image>
            </a-col>
            <a-col :span="6" flex-box="0">
                <div flex="dir:top" style="height: 100%">
                    <div flex-box="0">
                        <p class="f-mb-5">标签：</p>
                        <a-space wrap>
                            <a-tag v-for="i in (imageDetails.utag || '').split(' ').filter(Boolean)" :key="i"
                                   :color="'#' + Math.floor(Math.random()*0xffffff).toString(16)">{{ i }}
                            </a-tag>
                        </a-space>
                    </div>
                    <div flex-box="1">
                        <p class="f-mb-5">分辨率：</p>
                        <a-space wrap>
                            <a-tag v-for="r in resolution" :key="r.key" checkable
                                   :color="'#' + Math.floor(Math.random()*0xffffff).toString(16)"
                                   @check="handleResolutionClick(r)">{{ r.value }}
                            </a-tag>
                        </a-space>
                    </div>
                    <div flex-box="0" class="f-text-right">
                        <a-button type="primary" size="small" status="success" :loading="downloadBtnLoading"
                                  @click="handleDownload(imageDetails)">下载
                        </a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </a-modal>
</template>

<style scoped lang="less">
:deep(.arco-scrollbar, .arco-scrollbar-container) {
    //height: calc(100vh - 60px);
    height: 100%;
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
</style>
