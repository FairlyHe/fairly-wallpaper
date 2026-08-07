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
    <div flex-box="0" class="navigation-buttons navbarpadding">
      <a-button type="text" class="brand-button" @click="toUrl('/')">
        <img class="brand-logo" src="/fox-logo.png" alt="">
        <span class="brand-full">狐狸壁纸</span>
        <span class="brand-short">狐狸</span>
      </a-button>
    </div>

    <div flex-box="0" flex="main:center cross:center" class="right-part navbarpadding">
      <div>
        <a-space>
          <a-tooltip content="项目说明">
            <a-button shape="circle" aria-label="项目说明" @click="toUrl('/about')">
              <template #icon>
                <icon-info-circle />
              </template>
            </a-button>
          </a-tooltip>
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

.brand-short {
  display: none;
}

.brand-button {
  color: var(--color-text-1);
  font-weight: 600;
}

.brand-logo {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  object-fit: contain;
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

@media (max-width: 520px) {
  .navbarpadding {
    padding: 10px 12px;
  }

  .brand-full {
    display: none;
  }

  .brand-short {
    display: inline;
    font-weight: 700;
  }
}
</style>
