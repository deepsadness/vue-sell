<template>
  <div class="seller" ref="seller_scroll">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="favoriteClick" :class="{'active':favorite}">
          <span class="icon-favorite"></span>
          <span class="text">{{favorite?'已收藏':'收藏'}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="support">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="index">
            <left-icon :size='4' :index="item.type"></left-icon>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="scene" v-show="seller.pics && seller.pics.length">
        <h1 class="title">商家实景</h1>
        <div class="content-wrapper" ref="pic_scroll">
          <ul class="scene-list" ref="scene_list">
            <li class="scene-item" v-for="(scene,pindex) in seller.pics" :key="pindex">
              <img :src="scene" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info" v-show="seller.infos && seller.infos.length">
        <h1 class="title border-1px">商家信息</h1>
        <ul class="content-wrapper">
          <li :key="infoIndex" v-for="(info,infoIndex) in seller.infos" class="info-item">
            <span class="text">{{info}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../../components/star/star'
  import split from '../../components/split/split'
  import leftIcon from '@/components/leftIcon/leftIcon'
  import BScroll from 'better-scroll'

  import {saveToLocalStore, readFromLocalStore} from '../../common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return readFromLocalStore(this.seller.id, 'favorite', false)
        })()
      }
    },
    components: {
      star,
      split,
      leftIcon
    },
    created() {

    },
    mounted() {
      this._initScroll()
    },
    watch: {
      'seller'() {
        this._initScroll()
      }
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.seller_scroll, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
          if (this.seller.pics && this.seller.pics.length) {
            let width = 120
            let marginRight = 6
            let totalWidth = (width + marginRight) * this.seller.pics.length
            this.$refs.scene_list.style.width = totalWidth + 'px'

            this.$nextTick(() => {
              if (!this.picScroll) {
                this.picScroll = new BScroll(this.$refs.pic_scroll, {
                  scrollX: true,
                  eventPassthrough: 'vertical'
                })
              } else {
                this.picScroll.refresh()
              }
            })
          }

        })
      },
      favoriteClick() {
        this.favorite = !this.favorite
        saveToLocalStore(this.seller.id, 'favorite', this.favorite)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width: 100%
    overflow hidden
    .overview
      padding 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        line-height: 18px
        font-size: 0
        color rgb(77, 85, 93)
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          height: 18px
          display inline-block
          margin-right: 8px
          vertical-align top
        .text
          margin-right: 12px
          display inline-block
          vertical-align top
          font-size: 10px
      .remark
        display flex
        padding-top: 18px
        .block
          flex 1
          text-align center
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          &:last-child
            border none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size 10px
            color: rgb(147, 153, 159)
          .content
            margin-top: 4px
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size 24px
      .favorite
        position absolute
        top 18px
        right: 18px
        width: 50px
        font-size 0
        text-align center
        color rgb(147, 153, 159)
        &.active
          .icon-favorite
            color: rgb(240, 20, 20)
          .text
            color rgb(77, 85, 93)
        .icon-favorite
          display block
          vertical-align top
          font-size 24px
          line-height: 24px
        .text
          margin-top 4px
          display block
          font-size 10px
          line-height: 10px
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color rgb(7, 17, 27)
        font-size 14px
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          font-size 12px
          font-weight 200
          line-height: 24px
          color rgb(240, 20, 20)
      .support
        width: 100%
        margin 0 auto
      .support-item
        padding 16px 12px
        font-size 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          margin-bottom 0
          border-none()
        .text
          font-size 12px
          font-weight 200
          line-height 16px
    .scene
      padding 18px 0
      .title
        margin-left 18px
        margin-bottom: 12px
        line-height: 14px
        color rgb(7, 17, 27)
        font-size 14px
      .content-wrapper
        width: 100%
        margin 0
        white-space nowrap
        overflow hidden
        .scene-list
          font-size 0
          .scene-item
            display inline-block
            margin-right 6px
            width: 120px
            height: 90px
            &:first-child
              margin-left 18px
            &:last-child
              margin 0
    .info
      padding 18px 18px 0 18px
      .title
        padding-bottom: 12px
        line-height: 14px
        color rgb(7, 17, 27)
        font-size 14px
        border-1px(rgba(7, 17, 27, 0.1))
      .content-wrapper
        .info-item
          padding 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .text
            font-size 12px
            font-weight 200
            line-height 16px
            color rgb(7, 17, 27)
</style>
