<script>
export default {
  name: 'navbar',
}
</script>
<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import device from "current-device";
import { useDark, useToggle, useFullscreen } from '@vueuse/core';

const router = useRouter();

function forwardBackward(type) {
  if (type === 'forward') router.go(1);
  else router.go(-1);
}

const navMenu = ref( [
  {key: '1', title: '首页', icon: 'home', path: '/index'},
  {key: '2', title: '发现', icon: 'search', path: '/explore'},
  {key: '3', title: '音乐库', icon: 'music', path: '/library'}
]);


const defaultSelectedKeys = computed(() => {
  let navactive = []
  navMenu.value.map((item, index) => {
    if (router.currentRoute.value.path === item.path) {
      navactive.push(item.key)
    }
  })
  return navactive
})

function toUrl(e) {
  router.push({ path: e });
}

function handleSelect(e) {
  router.push({ path: e });
}

const keywords = ref('')
function handleSearch(e) {
  router.push({ path: '/search', query: { keywords: keywords.value } });
}

const appStore = useAppStore();
const theme = computed(() => {
  return appStore.theme;
});
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
function handleToggleTheme() {
  toggleTheme();
}
</script>

<template>
  <div flex="main:justify cross:center" class="" :class="device.mobile() ? '' : 'navbar'">
    <div flex-box="0" class="navigation-buttons navbarpadding" v-if="!device.mobile()">
      <a-button type="text">Fairly Wallpaper</a-button>
    </div>

    <div flex-box="0" flex="main:center cross:center" class="right-part navbarpadding" v-if="!device.mobile()">
      <div>
        <a-space>
          <a-tooltip :content="theme === 'light' ? '点击切换为暗黑模式' : '点击切换为亮色模式'">
            <a-button
                class=""
                shape="circle"
                @click="handleToggleTheme"
            >
              <template #icon>
                <icon-moon-fill v-if="theme === 'dark'" />
                <icon-sun-fill v-else />
              </template>
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.navbar {
}

.navbarpadding {
  padding: 14px 20px;
}

.navigation-buttons, .right-part {
  .arco-icon {
    color: initial;
    font-size: 24px;
  }
}

.navigation-links {
  :deep(.arco-menu-item) {
    font-size: 18px;
    font-weight: 700;
  }
  :deep(.arco-menu-selected-label) {
    display: none;
  }
}
</style>
