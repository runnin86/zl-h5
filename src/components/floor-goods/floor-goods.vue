<template>
<div>
  <div class="row recommend-goods" v-for="floor in composeFloorArr">
    <div class="floor_title"><span><img src="/static/images/floor_title.png"/>{{floor.title}}</span></div>
    <img :src="floor.banner" @click="redirectTo('category', floor.cat_id)">
    <div class="goods-lists clearfix">
      <div class="sub-goods_list" v-for="g in floor.goods_list" :key="g.goods_id" @click="redirectTo('goods', g.upc_id)">
        <div class="goods-img">
          <img :src="g.img_url?g.img_url:'/static/images/no_picture.jpg'">
        </div>
        <div class="goods-price">
          {{g.shop_price}}
          <span class="goods-price_origin">{{g.market_price}}</span>
        </div>
        <div class="goods-brief">{{g.goods_brief}}</div>
        <div class="goods-title">{{g.goods_name}}</div>
      </div>
      <div @click="redirectTo('category', floor.cat_id)" class="sub-goods_list">
        <div class="goods-more_list">
          <img src="/static/images/lettle_bg.png">
          <p class="see_more">
            <img src="/static/images/more.jpg">
            <span>查看更多</span>
            <span class="eng_more">See More</span>
          </p>
          <div class="space"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script type="text/babel">
export default {
  name: 'wv-floor-goods',
  props: {
    composeFloorArr: Array
  },
  methods: {
    redirectTo(type, id) {
      this.$emit('redirectTo', type, id)
    }
  }
}
</script>

<style>
.floor_title {
  text-align: center;
  background: #fff;
  color: #444;
  height: 1.92rem;
  line-height: 1.92rem;
}

.floor_title span {
  display: inline-block;
  position: relative;
  padding-left: 1rem;
  font-size: 0.6837rem
}

.floor_title span>img {
  position: absolute;
  width: 1.1rem;
  left: -0.2rem;
  top: 0.38rem;
}
</style>
