<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
        </div>
        <div class="price"></div>
        <div class="desc"></div>
      </div>
      <div class="content-right">
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
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
        .price
          display inline-block
          font-size 16px
          line-height 48px
          font-weight 700
        .desc
          display inline-block
      .content-right
        flex 0 0 105px

</style>
