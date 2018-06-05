<template>
  <div class="ratings" ref="ratings_scroll">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="score">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectedType" :onlyContent="onlyContent"
                    :desc="desc" @select="changeRatingType"
                    @toggle="changeRatingContent"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(item.rateType,item.text)"  v-for="(item,index) in ratings" class="rating-item border-1px" :key="index">
            <div class="avatar">
              <img :src="item.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{item.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="item.score"></star>
                <span class="delivery" v-show="item.deliveryTime">{{item.deliveryTime}}</span>
              </div>
              <p class="text">{{item.text}}</p>
              <div class="recommend" v-show="item.recommend && item.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="(recommend,rIndex) in item.recommend" :key="rIndex" class="item">{{recommend}}</span>
              </div>
              <div class="time">{{item.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../../components/star/star'
  import split from '../../components/split/split'
  import ratingselect from '../../components/ratingselect/ratingselect'
  import BScroll from 'better-scroll'

  import {formatDate} from '../../common/js/date'

  /* eslint-disable no-unused-vars */
  const POS = 0
  const NEG = 1
  const ALL = 2

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split,
      ratingselect
    },
    data() {
      return {
        ratings: [],
        showFlag: false,
        selectedType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          pos: '满意',
          neg: '不满意'
        }
      }
    },
    created() {
      this.$http.get('/api/ratings').then(res => {
        this.ratings = res.data.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings_scroll, {
            click: true
          })
        })
      })
    },
    methods: {
      changeRatingType(type) {
        // console.log('changeRatingType')
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

  .ratings
    position: absolute
    width: 100%
    bottom: 0
    top 174px
    overflow hidden
    .rating-content
      .overview
        display flex
        padding: 18px 0
        .overview-left
          padding 6px 0
          flex 0 0 137px
          border-right 1px solid rgba(7, 17, 27, 0.1)
          text-align center
          @media only screen and (max-width: 320px)
            flex 0 0 120px
            width: 120px
          .score
            margin-bottom: 6px
            line-height: 28px
            font-size: 24px
            color rgb(255, 153, 0)
          .title
            margin-bottom 8px
            line-height 12px
            font-size: 12px
            color rgb(7, 17, 27)
          .rank
            line-height: 10px
            font-size: 10px
            color rgb(147, 153, 159)
        .overview-right
          flex 1
          padding: 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding-left: 6px
          .score-wrapper
            margin-bottom: 8px
            font-size 0
            .title
              display inline-block
              vertical-align top
              font-size 12px
              line-height: 18px
              color rgb(7, 17, 27)
            .star
              display inline-block
              vertical-align top
              margin: 0 12px;
            .score
              line-height: 18px
              vertical-align top
              display inline-block
              font-size: 12px
              color rgb(255, 153, 0)
          .delivery-wrapper
            font-size: 0
            .title
              font-size 12px
              line-height: 18px
              color rgb(7, 17, 27)
            .score
              margin-left 12px
              line-height: 18px
              vertical-align top
              display inline-block
              font-size: 12px
              color rgb(147, 153, 159)

    .rating-wrapper
      padding: 0 18px
      .rating-item
        display flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex 0 0 28px
          margin-right: 12px
          width: 28px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom: 7px
            line-height: 12px
            color rgb(7, 17, 27)
            font-size: 10px
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display inline-block
              vertical-align top
              margin-right: 6px
            .delivery
              display inline-block
              vertical-align top
              margin-right: 6px
          .text
            margin-bottom: 8px
            line-height: 18px
            color rgb(7, 17, 27)
            font-size 12px
          .recommend
            font-size: 0
            line-height: 16px
            .icon-thumb_up, .item
              display inline-block
              font-size: 9px
              margin 0 8px 4px 0
            .icon-thumb_up
              color rgb(0, 160, 220)
            .item
              padding 0 6px
              border 1px solid rgba(7, 17, 27, 0.1)
              background: #fff
              color rgb(147, 153, 159)
              border-radius 1px
          .time
            position: absolute
            top 0
            right 0
            font-size: 10px
            color rgb(147, 153, 159)
            line-height: 12px
</style>
