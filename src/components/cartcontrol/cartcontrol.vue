<template>
    <div class="cartcontrol">
      <transition name="move">
          <div class="control-decrease" v-show="food.count > 0" @click="deleteCart($event)" transition="move">
            <!-- 由内部的图形来负责旋转 -->
            <div class="inner icon-remove_circle_outline"></div>
          </div>
      </transition>
      <!-- <div class="num" >{{food.count === 0 ? '': food.count}}</div> -->
      <div class="num" v-show="food.count" >{{food.count}}</div>
      <div class="control-add icon-add_circle" @click="addCart($event)"></div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
        addCart(event) {
          // 这里的事件必须是通过betterScroll派发的
          if (!event._constructed) {
            return
          }
          if (!this.food.count) {
            Vue.set(this.food, 'count', 1)
          } else {
            this.food.count++
          }
          // 将这个事件发送出去
          this.$emit('cart', event.target)
        },
        deleteCart(event) {
          if (!event._constructed) {
            return
          }
          let count = this.food.count
          count--
          if (count < 0) {
              count = 0
          }
          this.food.count = count
        }
    }
}
</script>

<style lang="stylus" scoped>
  .cartcontrol
    display inline-block
    height 24px
    line-height 24px
    font-size 0
    color rgb(0,160,220)
    // &.fade-enter-active, &.fade-leave-active
    //   transition: all .5s;
    // &.fade-enter, &.fade-leave-to
    //   opacity 0
    .control-decrease
      vertical-align top
      display inline-block
      .inner
        display inline-block
        font-size 24px
      &.move-enter-active, &.move-leave-active
        transition : all 0.2s linear
        .inner
          transition : all 0.2s linear
        // opacity 1
        // transform translate3d(0,0,0)
      &.move-enter, &.move-leave-to
        opacity 0
        transform translate3d(24px,0,0)
        .inner
          transform rotate(180deg)
    .num
      text-align center
      width 24px
      vertical-align top
      display inline-block
      font-size 10px
      color rgb(147,153,159)
    .control-add
      vertical-align top
      display inline-block
      font-size 24px
</style>
