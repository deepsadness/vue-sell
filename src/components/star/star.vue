<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>

<script>
  const LENGTH = 5
  const STAR_ON = 'on'
  const STAR_HALF = 'half'
  const STAR_OFF = 'off'

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'size-' + this.size
      },
      itemClasses() {
        let result = []
        let scoreResult = Math.floor(this.score * 2) / 2
        let hasDem = scoreResult % 1 !== 0
        let count = Math.floor(scoreResult)
        for (let i = 0; i < count; i++) {
          result.push(STAR_ON)
        }
        if (hasDem) {
          result.push(STAR_HALF)
        }
        for (let i = result.length; i < LENGTH; i++) {
          result.push(STAR_OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .star
    .star-item
      display inline-block
      background-repeat no-repeat
    &.size-48
      .star-item
        width: 20px
        height: 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-img('star48_on')
        &.half
          bg-img('star48_half')
        &.off
          bg-img('star48_off')
    &.size-36
      .star-item
        width: 15px
        height: 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-img('star36_on')
        &.half
          bg-img('star36_half')
        &.off
          bg-img('star36_off')
    &.size-24
      .star-item
        width: 10px
        height: 10px
        margin-right    3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-img('star24_on')
        &.half
          bg-img('star24_half')
        &.off
          bg-img('star24_off')
</style>
