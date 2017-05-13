<template>
  <div>
    <h1 class="error-code">404</h1>
  </div>
</template>

<script>
export default {
  activated() {
    this.$store.commit('CHANGE_IS_INDEX', false)
  }
}
</script>

<style>
  .error-code {
    display: block;
    color: #666;
    font-size: 4rem;
    font-weight: 200;
    text-align: center;
    top: 30%;
    left: 0;
    right: 0;
    margin: 0 auto;
    position: absolute;
  }
</style>
