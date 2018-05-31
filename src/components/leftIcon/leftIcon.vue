<template>
  <div class="left-icon" :class="typeClass">
    <!--<span class="icon-content" :class="classMap[index]"></span>-->
  </div>
</template>

<script>
  export default {
    props: {
      index: {
        type: Number
      },
      size: {
        type: Number
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    computed: {
      typeClass() {
        // :class="classMap[index]"
        return 'icon-' + this.size + ' ' + this.classMap[this.index]
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .left-icon
    vertical-align top
    display inline-block
  &.icon-1
    margin 0 2px 4px 0
    width 12px
    height 12px
    background-size 12px 12px;
    border-repeat no-repeat
    &.decrease
      bg-img('decrease_1')
    &.discount
      bg-img('discount_1')
    &.guarantee
      bg-img('guarantee_1')
    &.invoice
      bg-img('invoice_1')
    &.special
      bg-img('special_1')
  &.icon-2
    margin-right 6px
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
  &.icon-3
    margin-right 2px
    width 12px
    height: 12px
    border-repeat no-repeat
    background-size 12px 12px
    &.decrease
      bg-img('decrease_3')
    &.discount
      bg-img('discount_3')
    &.guarantee
      bg-img('guarantee_3')
    &.invoice
      bg-img('invoice_3')
    &.special
      bg-img('special_3')
</style>
