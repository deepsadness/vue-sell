<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="srcoll_content">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="carcontrol-wrapper">
            <cartcontrol :food="food" @cart="cartAdd"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.info"></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <ratingselect :ratings="food.ratings" :selectType="selectedType" :onlyContent="onlyContent"
                        :desc="desc" @select="changeRatingType"
                        @toggle="changeRatingContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(item.rateType,item.text)" v-for="(item,index) in food.ratings" :key="index"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{item.username}}</span>
                  <img class="avatar" :src="item.avatar" width="12" height="12">
                </div>
                <div class="time">{{item.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':item.rateType === 0,'icon-thumb_down':item.rateType===1}"></span>{{item.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import split from '@/components/split/split'
  import ratingselect from '@/components/ratingselect/ratingselect'

  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import {formatDate} from '../../common/js/date'
  /* eslint-disable no-unused-vars */
  const POS = 0
  const NEG = 1
  const ALL = 2

  export default {
    name: 'food',
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    data() {
      return {
        showFlag: false,
        selectedType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          pos: '推荐',
          neg: '吐槽'
        }
      }
    },
    methods: {
      show() {
        // 每次都初始化恢复这些变量
        this.selectedType = ALL
        this.onlyContent = false
        this.showFlag = true
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.srcoll_content, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      hide() {
        this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count > 0) {
          return
        }
        this.$emit('cart', event.target)
        Vue.set(this.food, 'count', 1)
      },
      cartAdd() {
        console.log(this.food.count, event.target)
        this.$emit('cart', event.target)
      },
      changeRatingType(type) {
        console.log('changeRatingType')
        if (this.selectedType === type) {
          return
        }
        this.selectedType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      changeRatingContent(contentFlag) {
        this.onlyContent = !contentFlag
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectedType === ALL) {
          return true
        } else {
          return type === this.selectedType
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width: 100%
    background: #fff;
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear
    &.move-enter, &.move-leave-to
      transform translate3d(100%, 0, 0)
    .image-header
      position relative
      width: 100%
      /*通过设置h0 和padingtop 100%，会根据宽带去计算盒子的大小*/
      height: 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width: 100%
        height: 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-top 8px
        margin-bottom 18px
        line-height 10px
        height: 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-size 14px
        line-height 24px
        font-weight 700
        height 24px
        .now
          color #f01414
          margin-right 8px
        .old
          color rgb(147, 153, 159)
          font-size 10px
          text-decoration line-through
      .carcontrol-wrapper
        position absolute
        right 18px
        bottom 18px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        line-height 24px
        padding 0 12px
        font-size 10px
        box-sizing border-box
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220);
        height 24px
        &.fade-enter-active, &fade-enter-leave
          transition all 0.1s
        &.fade-enter, &.fade-leave-to
          opacity 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size 12px
        color rgb(77, 85, 93)

    .rating
      padding-top 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right 0
            top 16px
            font-size 0
            line-height: 12px
            .name
              margin-right: 6px
              display inline-block
              vertical-align top
              font-size: 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom: 6px
            font-size: 10px
            color rgb(147, 153, 159)
            line-height: 12px
          .text
            font-size 12px
            color: rgb(7, 17, 27)
            line-height: 16px
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              font-size: 12px
              line-height: 24px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          color rgb(147, 153, 159)
          font-size 12px
</style>
