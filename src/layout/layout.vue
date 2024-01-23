<script setup>
import NavBar from './components/navbar/index.vue';
import Player from '@/components/Player.vue';
</script>

<template>
  <a-layout class="layout">
    <a-layout-header>
      <NavBar></NavBar>
    </a-layout-header>

    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>

    <a-layout-footer>
      <!--<Player></Player>-->
    </a-layout-footer>
  </a-layout>
</template>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
  .content{
    height: calc(100vh - 60px);
    overflow-y: hidden;
  }
  .arco-scrollbar{
    height: 100%;
    //padding: 0 5vw;
  }
}
</style>
