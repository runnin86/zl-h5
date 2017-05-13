<template>
  <div>
    <div class="social-share"></div>

    <div class='swipe' style='margin:10px;'>
      <ul id='slider1'>
        <li><div>1</div></li>
        <li><div>2</div></li>
        <li><div>3</div></li>
        <li><div>4</div></li>
        <li><div>5</div></li>
      </ul>
    </div>

    <div class="weui-msg">
      <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
      <div class="weui-msg__text-area">
        <h2 class="weui-msg__title">操作成功</h2>
        <p class="weui-msg__desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<a href="javascript:void(0);">文字链接</a></p>
      </div>
      <div class="weui-msg__opr-area">
        <p class="weui-btn-area">
          <a href="javascript:;" @click="toast" class="weui-btn weui-btn_primary">推荐操作</a>
          <a href="javascript:;" class="weui-btn weui-btn_default">辅助操作</a>
        </p>
      </div>

      <div class="weui-cells weui-cells_checkbox">
        <label class="weui-cell weui-check__label" for="s11">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check" name="checkbox1" id="s11" checked="checked">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">
            <p>standard is dealt for u.</p>
          </div>
        </label>
        <label class="weui-cell weui-check__label" for="s12">
          <div class="weui-cell__hd">
            <input type="checkbox" name="checkbox2" class="weui-check" id="s12">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">
            <p>standard is dealicient for u.</p>
          </div>
        </label>
        <a href="javascript:void(0);" class="weui-cell weui-cell_link">
          <div class="weui-cell__bd">添加更多</div>
        </a>
      </div>

      <div class="weui-msg__extra-area">
        <div class="weui-footer">
          <p class="weui-footer__links">
            <a href="javascript:void(0);" class="weui-footer__link">底部链接文本</a>
          </p>
          <p class="weui-footer__text">Copyright © 2008-2016 weui.io</p>
        </div>
      </div>
    </div>

    <wv-preview class="preview-item" title="订单详情" value="100.00" :dataItems="dataItems" :buttons="buttons1"></wv-preview>
    <wv-preview class="preview-item" title="订单详情" value="100.00" :dataItems="dataItems" :buttons="buttons2"></wv-preview>
		<wv-preview class="preview-item" title="订单详情" value="100.00" :dataItems="dataItems" :buttons="buttons1"></wv-preview>
		<wv-preview class="preview-item" title="订单详情" value="100.00" :dataItems="dataItems" :buttons="buttons2"></wv-preview>
  </div>
</template>

<script>
import weui from 'weui.js'

export default {
  init () {
    console.log('初始化')
  },
  created () {
    console.log('创建')
  },
  mounted () {
    let touchslider = require('touchslider')
    touchslider('slider1', {
      duration: 800,
      interval: 3000,
      direction: 0,
      autoplay: false,
      align: 'left',
      mousewheel: false,
      mouse: true,
      fullsize: false
    })
  },
  data () {
    return {
      dataItems: [
        {
          label: '商品',
          value: '电动打蛋机'
        },
        {
          label: '标题标题',
          value: '名字名字名字'
        },
        {
          label: '标题标题',
          value: '很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字'
        }
      ],
      buttons1: [{
        text: '操作',
        type: 'primary',
        action: function () {
          console.log('执行主要操作……')
        }
      }],
      buttons2: [{
        text: '辅助操作',
        type: 'default',
        action: function () {
          console.log('执行辅助操作……')
        }
      }, {
        text: '操作',
        type: 'primary',
        action: function () {
          console.log('执行主要操作……')
        }
      }]
    }
  },
  methods: {
    toast () {
      weui.topTips('请填写正确的字段')
      // weui.alert('普通的alert')
      // weui.toast('操作成功', 3000)
    }
  }
}
</script>

<style scoped>
.preview-item {
  margin-bottom: 20px;
}
html, body, div, span, object, iframe, h1, h2, h3, h4, h5, h6, p, del, dfn, em, img, ins, kbd, q, samp, small, strong, b, i, dl, dt, dd, ol, ul, li, fieldset, form, label, table, tbody, tfoot, thead, tr, th, td, article, aside, footer, header, nav, section {
  margin:0;
  padding:0;
  border:0;
  outline:0;
  font-size:100%;
  vertical-align:baseline;
  background:transparent;
}
body {
  -webkit-text-size-adjust:none;
  font-family:sans-serif;
}
h1 {
  font-size:36px;
  margin:15px;
  text-align:center;
  color:#666;
}
h2 {
  font-size:14px;
  font-weight:bold;
  color:#3c3c3c;
  margin:20px 10px 10px;
}
small {
  margin:0 10px 30px;
  display:block;
  font-size:12px;
}
a {
  margin:0 0 0 10px;
  font-size:12px;
  color:#3c3c3c;
}
.swipe {
  margin-bottom:20px;
  overflow:hidden;
  position:relative;
  width:100%;
}
.swipe ul{
    overflow:hidden;
}
.swipe li div, .swipe div div div {
  padding:50px 10px;
  background:#1db1ff;
  font-weight:bold;
  color:#fff;
  font-size:20px;
  text-align:center;
}
.swipe li  img{
	max-width:80%;
}
.swipe li{
	margin:10px;
}
#slider2 li{
    width:230px;
}
#slider4{
	line-height:0;
	text-align:center;
}
#slider4 ul{
	-webkit-transition:left 800ms ease-in 0;
	-moz-transition:left 800ms ease-in 0;
	-o-transition:left 800ms ease-in 0;
	-ms-transition:left 800ms ease-in 0;
	transition:left 800ms ease-in 0;
}
#pagenavi a.active{
	color:red;
}
#copyright{
	text-align:center;
	font-size:16px;
	padding:30px 0;
}
#copyright a{
	font-weight:bold;
	font-size:16px;
}

#slider li{
	width:300px;
	float:left;
}
#slider li:first-child{
	width:100px;
	margin:10px 40px;
}
#slider li:last-child{
	width:500px;
	border:3px solid #111;
}
#slider li:nth-child(2){
	width:200px;
}
#slider li:nth-child(3){
	width:300px;
}
#slider li:nth-child(4){
	width:400px;
}
#slider1 li{
	width:240px;
}
</style>
