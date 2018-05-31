<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rating">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">卖家</router-link>
      </div>
    </div>
    <!--<div @click="request">点击请求</div>-->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import Header from '@/components/header/Header'
  // import axios from 'axios'
  export default {
    name: 'App',
    data() {
      return {
        seller: {}
      }
    },
    components: {
      'v-header': Header
    },
    methods: {
      request: function () {
        this.$http.get('/api/seller')
          .then(res => {
            this.seller = res.data.data
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    created: function () {
      this.$http.get('/api/seller')
        .then(res => {
          this.seller = res.data.data
          console.log(res.data.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"
  .tab
    display: flex;
    line-height: 40px;
    height: 40px
    width: 100%;
    .tab-item
      flex: 1;
      text-align: center;
      /*表示在.tab .a*/
      & > a
        //点击的区域变成一个block
        display: block;
        text-decoration: none;
        font-size: 14px;
        color: rgb(77, 85, 93);
        border-1px(rgba(7, 17, 27, 0.1))
        &.router-link-active
          color: rgb(240, 20, 20);
</style>
