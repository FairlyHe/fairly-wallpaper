<script>
export default {
  name: 'Player'
}
</script>
<script setup>

</script>

<template>
  <div class="player">
    <div class="progress-bar">
      <a-slider :default-value="100" :style="{ width: '100%' }" />
    </div>
    <div class="controls">
      <div class="playing"></div>
      <div class="middle-control-buttons"></div>
      <div class="right-control-buttons"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.player{
  overflow: hidden;
  padding: 0 5px;
}
</style>
