<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>{{title_name}}</span>
      </div>
      <div class="col-xs-2"></div>
    </div>
    <div class="row panic-buying_activity">
      <div class="recommend-goods">
        <a class="goods-banner_pic" href="javascript:void(0)">
          <img :src="imgBase64" :style="{backgroundImage: 'url(' + (ac_res ? (img_domain + ac_res.banner) : '/static/images/no_picture.jpg') + ')'}">
        </a>
        <div class="time-count_down" v-if="ac_res">
          <wv-count-down 
            v-on:start="countDownS_cb(1)" v-on:end="countDownE_cb(1)"
            :startTime="ac_res.start_time" :endTime="ac_res.end_time"
            :tipText="'距离开始'" :tipTextEnd="'距离结束'" :endText="'活动已结束'">
          </wv-count-down>
        </div>
        <div class="goods-lists clearfix">
          <router-link class="sub-goods_list" v-for="g in goods_list" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.goods_id}}">
            <div class="goods-img">
              <img :src="imgBase64" :style="{backgroundImage: 'url(/static/images/no_picture.jpg)'}">
            </div>
            <div class="goods-brief">{{g.goods_brief}}</div>
            <div class="goods-title">{{g.goods_name}}</div>
            <div class="goods-price">
              {{g.promote_price}}
              <span class="goods-price_origin">{{g.market_price}}</span>
            </div>
            <div class="btn-panic_buy">
              <input type="button" value="立即抢购">
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      goods_list: [],
      ac_res: '',
      img_domain: '',
      title_name: ''
    }
  },
  /*
   * 页面激活
   */
  activated () {
    this.loadFavourable()
  },
  methods: {
    countDownS_cb(a) {
      console.log('callBack--' + a + '--开始倒计时结束回调')
    },
    countDownE_cb(a) {
      console.log('callBack--' + a + '--活动剩余倒计时结束回调')
    },
    loadFavourable () {
      this.$http.get('favourable_goods.php', {
        params: {
          id: this.$route.query.id
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.goods_list = data.goods_list
          this.ac_res = data.ac_res
          this.img_domain = data.img_domain
          this.title_name = data.title_name
        } else {
          console.error('获取商品列表失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
    }
  },
  updated () {
  },
  beforeDestroy () {
    // 组件销毁之前
  },
  destroyed () {
    // 组件销毁后
  }
}
</script>

<style>
.recommend-goods{padding-top: 0}
.btn-panic_buy{
  padding: 4px 8px;
  border-top: 1px solid #eee;
}
.btn-panic_buy input{
  background: #ef0021;
  border: 1px solid #ef0021;
  border-radius: 4px;
  color: #fff;
  width: 100%;
  padding: 6px 0;
}
.panic-buying_activity{margin-bottom: 10px}
.goods-lists .sub-goods_list {
  margin-top:4px;
}
.time-count_down{
  text-align: center;
  height: 62px;
  line-height: 62px;
}
.time-count_down span:last-child{
  color:#fff;
  background: #ef0021;
  padding:4px;
  border-radius: 3px;
  margin:0 3px;
}
.time-count_down span:nth-child(3) , .time-count_down span:nth-child(4){
  color:#fff;
  background: #ef0021;
  padding:4px;
  margin:0 3px;
  border-radius: 4px
}
</style>
