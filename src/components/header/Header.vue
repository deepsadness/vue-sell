<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
      </div>
    </div>
    <div class="bottom-wrapper" @click="showDetail">
      <span class="bottom-icon"></span><span class="bottom-text" v-if="seller.bulletin">{{seller.bulletin}}</span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <p class="name">{{seller.name}}</p>
            <div class="star-wrapper">
              <star size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <i class="line"></i>
              <span class="content">优惠信息</span>
              <i class="line"></i>
            </div>
            <div v-if="seller.supports" class="support">
              <div class="support-item" v-for="(item,index) in seller.supports" :key="index">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </div>
            </div>
            <div class="title">
              <i class="line"></i>
              <span class="content">商家公告</span>
              <i class="line"></i>
            </div>
            <p class="bulletin">{{seller.bulletin}}</p>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from '@/components/star/star'

  export default {
    name: 'header',
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      showDetail() {
        this.detailShow = true
      },
      hideDetail() {
        this.detailShow = false
      }
    },
    data() {
      return {
        detailShow: false
      }
    },
    components: {
      star
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .header
    overflow hidden
    position relative
    color rgb(255, 255, 255)
    background rgba(7, 17, 27, 0.5)
    .content-wrapper
      position relative
      padding 24px 24px 18px 24px
      font-size 0
      .avatar
        vertical-align top
        display inline-block
        img
          border-radius 2px
      .content
        display inline-block
        margin-left 16px
        font-size 14px
        .title
          margin 2px 6px 8px 0px
          .brand
            vertical-align top
            display inline-block
            bg-img('brand')
            background-size 30px 18px;
            border-repeat no-repeat
            width: 30px
            height: 18px
          .name
            font-size 16px
            font-weight bold
            line-height 18px
        .description
          margin-bottom 10px
          font-size 12px
          line-height 12px
        .support
          font-size 10px
          line-height 12px
          .icon
            margin 0 2px 4px 0
            vertical-align top
            display inline-block
            width 12px
            height 12px
            &.decrease
              bg-img('decrease_1')
              background-size 12px 12px;
              border-repeat no-repeat
            &.discount
              bg-img('discount_1')
              background-size 12px 12px;
              border-repeat no-repeat
            &.guarantee
              bg-img('guarantee_1')
              background-size 12px 12px;
              border-repeat no-repeat
            &.invoice
              bg-img('invoice_1')
              background-size 12px 12px;
              border-repeat no-repeat
            &.special
              bg-img('special_1')
              background-size 12px 12px;
              border-repeat no-repeat
      .support-count
        position absolute
        right: 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, 0.2)
        text-align center
        .count
          line-height 24px
          font-size 10px
    .bottom-wrapper
      background rgba(7, 17, 27, 0.2)
      height: 28px
      line-height 28px
      padding 0 12px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bottom-icon
        vertical-align top
        margin-top 8px
        display inline-block
        width: 22px
        height: 12px;
        bg-img('bulletin')
        background-size 22px 12px
        border-repeat no-repeat
      .bottom-text
        vertical-align top
        margin 0 4px 0 4px
        font-size 10px

    .background
      position absolute
      top 0
      width 100%
      height 100%
      z-index -1
      left 0
      filter blur(10px)
    .detail
      &.fade-enter-active, &.fade-leave-active
        transition: all .5s
      &.fade-enter, &.fade-leave-to
        opacity: 0
      position fixed
      z-index 100
      top 0
      left 0
      height 100%
      width 100%
      overflow auto
      background rgba(7, 17, 27, 0.8)
      backdrop-filter blur(10px)
      .detail-wrapper
        width 100%
        min-height: 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
          .star-wrapper
            text-align center
            margin-top 18px
            padding 2px 0
          .title
            margin 28px 36px 24px 36px
            width: 80%
            display flex
            .line
              flex 1 auto
              border-top 1px solid rgba(255, 255, 255, 0.2)
              margin-top 14px
            .content
              margin 0 12px
              font-size 14px
              font-weight 700
              line-height 28px
          .support
            width: 80%
            margin 0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
              .icon
                margin-right 6px
                vertical-align top
                display inline-block
                width 16px
                height: 16px
                border-repeat no-repeat
                background-size 16px 16px
                &.decrease
                  bg-img('decrease_2')
                &.discount
                  bg-img('discount_2')
                &.guarantee
                  bg-img('guarantee_2')
                &.invoice
                  bg-img('invoice_2')
                &.special
                  bg-img('special_2')
              .text
                font-size 12px
                font-weight 200
                line-height 16px
          .bulletin
            margin 0 36px
            line-height 24px
            font-size 12px
            font-weight 200
            padding 0 12px
      .detail-close
        position relative
        width: 32px
        height: 32px
        margin -64px auto 0 auto
        clear both
        font-size 32px
</style>
