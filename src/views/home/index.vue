<script>
export default {
  name: 'index'
}
</script>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import {API_ALLCATEGORIES_GET, API_BANNER_GET, API_PERSONALIZED_GET} from '@/api/home';

const router = useRouter();

const defaultCurrent = ref(['6'])
const navList = ref([])
// 获取分类列表
function getAllcategories() {
  API_ALLCATEGORIES_GET({
    c: 'WallPaper',
    a: 'getAllCategories'
  }).then(res => {
    // console.log(1111,res)
    navList.value = res.data
    getAllcategoriesList()
  }).catch(err => {
  })
}
// 获取分类下 图片列表
const loading = ref(false)
const pageSize = ref(20) // 每页展示的数据条数
const total = ref(0) // 数据总数
const current = ref(1) // 当前页数

const wallpaperList = ref([])
function getAllcategoriesList() {
  loading.value = true
  API_ALLCATEGORIES_GET({
    c: 'WallPaper',
    a: 'getAppsByCategory',
    cid: defaultCurrent.value[0],
    start: 0
  }).then(res => {
    // console.log(2222,res)
    total.value = Number(res.total)

    wallpaperList.value = res.data
    loading.value = false
  }).catch(err => {
  })
}
function changeAllcategoriesList(page) {
  loading.value = true
  API_ALLCATEGORIES_GET({
    c: 'WallPaper',
    a: 'getAppsByCategory',
    cid: defaultCurrent.value[0],
    start: (page - 1) * pageSize.value
  }).then(res => {
    // console.log(2222,res)
    wallpaperList.value = res.data
    loading.value = false
  }).catch(err => {
  })
}

function handleClick(key) {
  defaultCurrent.value = [key]
  getAllcategoriesList()
}

const imageVisible = ref(false)
const imageDetails = ref({
  utag: ''
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
  window.open(imageDetails.value[item.key])
}

const downloadBtnLoading = ref(false)
function handleDwonload(row, name) {
  downloadBtnLoading.value = true

  //下载图片地址和图片名
  let image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  let names = 'image' + row.url.split('/').pop()
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = names || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = row.url

  setTimeout(() => {
    downloadBtnLoading.value = false
  }, 2000)
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
              :default-selected-keys="defaultCurrent"
              @menu-item-click="handleClick"
          >
            <a-menu-item v-for="(item, index) in navList" :key="item.id">{{ item.name }}</a-menu-item>
          </a-menu>
        </div>
      </a-scrollbar>
    </div>
    <div flex-box="1" flex="dir:top">
      <div flex-box="1" class="aaaaa" style="height: 100%; overflow: auto;">
        <a-scrollbar style="height: 100%; overflow: auto">
          <div flex="main:center cross:center" style="height: 100%" v-if="wallpaperList.length === 0">
            <a-result status="404" title="暂时没有壁纸" subtitle="请查看其它分类吧！"></a-result>
          </div>
          <a-spin :loading="loading" tip="努力插入中..." v-else>
            <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5  }" :colGap="12" :rowGap="16" class="grid-demo-grid">
              <a-grid-item class="demo-item" v-for="(item, index) in wallpaperList">
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
          <a-pagination :total="total" @change="changeAllcategoriesList" />
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
              <a-tag v-for="i in imageDetails.utag.split(' ')" :color="'#' + Math.floor(Math.random()*0xffffff).toString(16)">{{ i }}</a-tag>
            </a-space>
          </div>
          <div flex-box="1">
            <p class="f-mb-5">分辨率：</p>
            <a-space wrap>
              <a-tag v-for="r in resolution" checkable :color="'#' + Math.floor(Math.random()*0xffffff).toString(16)" @check="handleResolutionClick(r)">{{ r.value }}</a-tag>
            </a-space>
          </div>
          <div flex-box="0" class="f-text-right">
            <a-button type="primary" size="small" status="success" :loading="downloadBtnLoading" @click="handleDwonload(imageDetails)">下载</a-button>
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
.loader-animate {
  width: 100%;
  height: 100%;
  background: linear-gradient(
      -60deg,
      var(--color-fill-2) 25%,
      var(--color-neutral-3) 40%,
      var(--color-fill-3) 55%
  );
  background-size: 400% 100%;
  animation: loop-circle 1.5s cubic-bezier(0.34, 0.69, 0.1, 1) infinite;
}
</style>
