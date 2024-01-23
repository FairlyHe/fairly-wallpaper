<script setup>
import { ref, computed } from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

const currentLocale = ref('zh-CN');
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
});
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
