<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'has-item':totalCount > 0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="count-wrapper" v-show="totalCount > 0">
            <span class="count">{{totalCount}}</span>
          </div>
        </div>
        <div class="price" :class="{'highlight':totalPrice > 0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="{'enough':totalPrice >= minPrice}">
        <!-- <span class="result-price">¥{{minPrice}}元起送</span> -->
        <span class="result-price">{{resultPrice}}</span>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" v-on:before-enter="dropBeforeEnter" v-on:enter="dropEnter" v-on:after-enter="dropAfterEnter">
        <div v-for="(ball,index) in balls" v-show="ball.show" :key="index" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 因为要计算总共的价格，所以保存选择的结果
      selectedFoods: {
        type: Array,
        // 这里默认的参数需要变成一个方法
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 同时出现的动画数量
        balls: [
          {
          'show': false
          },
          {
          'show': false
          },
          {
          'show': false
          },
          {
          'show': false
          }
        ],
        dropBalls: []
      }
    },
    computed: {
      totalPrice() {
        let totalPrice = 0
        this.selectedFoods.forEach(it => {
          totalPrice += it.price * (it.count || 0)
        })
        return totalPrice
      },
      totalCount() {
         let totalCount = 0
         this.selectedFoods.forEach(it => {
          totalCount += it.count
        })
        return totalCount
      },
      resultPrice() {
        let totalPrice = this.totalPrice
        if (totalPrice === 0) {
          return '¥' + this.minPrice + '元起送'
        } else if (totalPrice >= this.minPrice) {
          return '去结算'
        } else {
          let diff = this.minPrice - totalPrice
          return '还差¥' + diff + '元起送'
        }
      }
    },
    methods: {
      drop(el) {
        console.log(el)
        for (let index = 0; index < this.balls.length; index++) {
          const ball = this.balls[index]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      dropBeforeEnter(el) {
        for (let i = 0; i < this.dropBalls.length; i++) {
          const ball = this.dropBalls[i]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top -30)
            el.style.display = ''
            el.style.webKitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webKitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropEnter(el) {
        // 强制刷新
        /* eslint-disable no-unused-vars */
        let ref = el.offsetHeight
        this.$nextTick(() => {
          // 重置变量
          el.style.webKitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webKitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      dropAfterEnter(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .shopcart
    position fixed
    bottom 0
    left 0
    height 48px
    width: 100%
    z-index: 50
    .content
      height: 100%
      display flex
      background: #141d27
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        font-size 0
        .logo-wrapper
          display inline-block
          width: 56px
          height: 56px
          margin 0 12px
          padding 6px
          position relative
          top -10px
          left 0
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius 50%
            text-align center
            background: rgb(43, 52, 60)
            .icon-shopping_cart
              font-size 25px
              line-height 44px
              color: #80858a
            &.has-item
              background: rgb(0, 160, 220)
              .icon-shopping_cart
                color: #fff
          .count-wrapper
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            z-index 60
            border-radius 16px
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
            background rgb(240, 20, 20)
            box-sizing border-box
            text-align center
            .count
              font-size 9px
              line-height 16px
              color #fff
        .price
          display inline-block
          vertical-align top
          font-size 16px
          line-height 24px
          font-weight 700
          box-sizing border-box
          margin-top 12px
          padding-right 12px
          border-right 1px solid rgba(255,255,255,0.1)
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          font-size 14px
          line-height 24px
          box-sizing border-box
          margin-top 12px
          padding-left 12px
      .content-right
        text-align center
        flex 0 0 105px
        background: rgb(43, 52, 60)
        padding 0px 8px
        box-sizing border-box
        .result-price
          display inline-block
          height 48px
          font-size 12px
          line-height 48px
          font-weight 700
        &.enough
          background: #1b9456
          .result-price
            color #fff
            font-size 14px
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
        &.drop-enter-active
          transition all .4s cubic-bezier(.57,-0.31,.8,.46)
          .inner
            transition all .4s linear
</style>
