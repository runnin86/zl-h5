<template>
  <div class="weui-footer">
    <p class="weui-footer__links" v-if="links.length > 0">
      <FooterLink v-for="item in links" :key="item.id" :text="item.text" :to="item.link"></FooterLink>
    </p>
    <p class="weui-footer__text" v-html="text"></p>
  </div>
</template>

<script type="text/babel">
import FooterLink from './footer-link.vue'

export default {
  name: 'wv-footer',

  components: {
    FooterLink
  },

  props: {
    text: String,
    links: {
      type: Array,
      default: () => []
    }
  }
}
</script>
