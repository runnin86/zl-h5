<template>
<header class="wv-header" :class="{ 'is-fixed': fixed }" @click.stop="$emit('headerClick')" :style="{ 'background-color': backgroundColor }">
  <div class="wv-header-btn left">
    <slot name="left"></slot>
  </div>
  <div class="wv-header-title" v-text="title"></div>
  <div class="wv-header-btn right">
    <slot name="right"></slot>
  </div>
</header>
</template>

<script type="text/babel">
export default {
  name: 'wv-header',

  props: {
    title: String,
    fixed: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#21292c'
    }
  }
}
</script>

<style scoped>
.wv-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  line-height: 1;
  padding: 0 10px;
  margin: 0;
  color: white;
  position: relative;
  white-space: nowrap;
}

.wv-header .left {
  display: block;
  overflow: hidden;
  float: left;
  font-size: 35px;
  line-height: 35px;
  font-weight: 100;
}

.wv-header .wv-header-title {
  font-size: 23px;
  font-weight: 0;
  text-align: center;
  flex: 1;
}

.wv-header.is-fixed {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
}
</style>
