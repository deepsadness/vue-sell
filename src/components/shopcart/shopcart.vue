<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
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
        <div class="content-right" :class="{'enough':totalPrice >= minPrice}" @click.stop.prevent="pay">
          <!-- <span class="result-price">¥{{minPrice}}元起送</span> -->
          <span class="result-price">{{resultPrice}}</span>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" v-on:before-enter="dropBeforeEnter" v-on:enter="dropEnter"
                          v-on:after-enter="dropAfterEnter">
          <div v-for="(ball,index) in balls" v-show="ball.show" :key="index" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptySelected">清空</span>
          </div>
          <div class="list-content" ref="food_scroll">
            <ul>
              <li class="list-item border-1px" v-for="(food,index) in selectedFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥ {{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart="drop"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>
<script>
  import cartcontrol from '../../components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

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
        dropBalls: [],
        fold: true
      }
    },
    components: {
      cartcontrol,
      BScroll
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
      },
      listShow() {
        if (!this.totalCount) {
          // eslint-disable-next-line
          this.fold = true
          return false
        }
        if (!this.fold) {
          this._initScroll()
        }
        return !this.fold
      }
    },
    methods: {
      drop(el) {
        // console.log('drop index' + el)
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
            // console.log('dropBeforeEnter index' + i, ball.el)
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 30)
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
      },
      emptySelected() {
        // console.log('clear')
        this.selectedFoods.forEach((food) => {
          food.count = 0
        })
      },
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      hideList() {
        this.fold = true
      },
      _initScroll() {
        this.$nextTick(() => {
          // 如果没有初始化，则进行初始化
          if (!this.foodScroll) {
            this.foodScroll = new BScroll(this.$refs.food_scroll, {
              click: true
            })
          } else {
            // 调用刷新的接口
            this.foodScroll.refresh()
          }
        })
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        // 同结算
        window.alert(`支付${this.totalPrice}`)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

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
      color rgba(255, 255, 255, 0.4)
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
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
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
          border-right 1px solid rgba(255, 255, 255, 0.1)
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
          background rgb(0, 160, 220)
        &.drop-enter-active
          transition all .2s cubic-bezier(.57, -0.31, .8, .46)
          .inner
            transition all .2s linear
    .shopcart-list
      font-size 0
      position absolute
      top 0
      left 0
      width: 100%
      transform translate3d(0, -100%, 0)
      z-index -1
      &.fold-enter-active
        transition all 0.5s linear
        transform translate3d(0, -100%, 0)
      &.fold-leave-active
        transition all 0.5s linear
        transform translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      .list-header
        padding 0 18px
        background: #f3f5f7
        height: 40px
        line-height 40px
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size 14px
          font-weight 200
          color: rgb(7, 17, 27)
        .empty
          //浮动相当于gravity
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background: #fff
        .list-item
          position relative
          padding 12px 0
          border-1px(rgba(7, 17, 27, 0.1))
          box-sizing border-box
          .name
            font-size 14px
            color rgb(7, 17, 27)
            line-height 24px
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px

  .list-mask
    position fixed
    top 0
    left 0
    width: 100%
    height: 100%
    z-index 40
    backdrop-filter: blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    /*backdrop-filter: blur(10px)
    background: rgba(7,17,27,0.6)*/
    &.fade-enter, &.fade-leave-to
      opacity 0
      background: rgb(7, 17, 27);
</style>
