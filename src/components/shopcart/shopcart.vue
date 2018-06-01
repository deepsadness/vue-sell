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
        <div class="price">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="{'enough':totalPrice >= minPrice}">
        <!-- <span class="result-price">¥{{minPrice}}元起送</span> -->
        <span class="result-price">{{resultPrice}}</span>
      </div>
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
          return [
            {
              'price': 10,
            },
            {
              'price': 10,
              }
            ]
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
        if(totalPrice === 0){
          return '¥'+this.minPrice+'元起送'
        }else if(totalPrice >= this.minPrice ){
          return '去结算'
        }else {
          let diff = this.minPrice - totalPrice
          return '还差¥'+diff+'元起送'
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
            position relative
            top -50px
            left 24px
            width 30px
            height 18px
            z-index 60
            border-radius 12px
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
            background rgb(240, 20, 20)
            box-sizing border-box
            text-align center
            .count
              font-size 9px
              line-height 18px
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
          
</style>
