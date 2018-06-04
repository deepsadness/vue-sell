<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block all" :class="{'active':selectType==2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block pos" :class="{'active':selectType==0}">{{desc.pos}}<span
        class=" count">{{posRatingCount.length}}</span></span>
      <span @click="select(1,$event)" class="block neg" :class="{'active':selectType==1}">{{desc.neg}}<span
        class=" count">{{negRatingCount.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  const POS = 0
  const NEG = 1
  const ALL = 2

  export default {
    name: 'ratingselect',
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            pos: '满意',
            neg: '吐槽'
          }
        }
      }
    },
    computed: {
      posRatingCount() {
        return this.ratings.filter((it) => {
          return it.rateType === POS
        })
      },
      negRatingCount() {
        return this.ratings.filter((it) => {
          return it.rateType === NEG
        })
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return
        }
        if (this.selectType === type) {
          return
        }
        this.$emit('select', type)
        console.log(type)
      },
      toggleContent(event) {
        console.log(this.onlyContent)
        if (!event._constructed) {
          return
        }
        this.$emit('toggle', this.onlyContent)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin 0 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      .block
        display inline-block
        padding 8px 12px
        color rgb(77, 85, 93)
        border-radius 2px
        font-size: 12px
        height 16px
        margin-right: 8px
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
          line-height: 16px
        &.all
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.pos
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.neg
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right: 4px
        font-size: 24px
      .text
        display inline-block
        vertical-align top
        font-size: 12px
</style>
