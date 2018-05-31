<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item">
          <span class="text border-1px"><left-icon v-show="item.type>0" :size="3" :index="item.type"></left-icon>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="food-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-item">
          <div class="food-name">{{item.name}}</div>
          <div class="food-content border-1px" v-for="(food,foodIndex) in item.foods" :key="foodIndex">
            <div class="food-img">
              <img :src="food.icon" width="57" height="57">
            </div>
            <div class="food-text">
              <h2 class="name">{{food.name}}</h2>
              <p class="description">{{food.description}}</p>
              <div class="extra">
                <span class="sell-count">月售{{food.sellCount}}</span>
                <span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">¥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import leftIcon from '@/components/leftIcon/leftIcon'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'left-icon': leftIcon
    },
    data() {
      return {
        goods: []
      }
    },
    created() {
      this.$http.get('/api/goods')
        .then(res => {
          this.goods = res.data.data
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .goods
    position absolute
    top 176px
    bottom 46px
    width 100%
    display flex
    overflow hidden
    .menu-wrapper
      font-size 0
      background #f3f5f7
      flex 0 0 80px
      width: 80px
      .menu-item
        display table
        height: 54px
        width: 56px
        padding 0 12px
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          line-height 14px
          width: 56px
          border-1px(rgba(7, 17, 27, 0.1))
    .food-wrapper
      flex 1
      .food-name
        border-left 2px solid #d9dde1
        padding 0 14px
        background #f3f5f7
        color rgb(147, 153, 159)
        line-height 26px
        height: 26px
        font-size 12px
      .food-content
        margin 18px
        display flex
        flex-direction row
        border-1px(rgba(7, 17, 27, 0.1))
        padding-bottom 18px
        &:last-child
          border-none()
          margin-bottom 0
        .food-img
          flex 0 0 57px
          margin-right 10px
        .food-text
          flex 1
          .name
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            color rgb(7, 17, 27)
          .description, .extra
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .description
            margin-bottom 8px
            .sell-count
              margin-right 12px
          .price
            font-size 14px
            line-height 24px
            font-weight 700
            .now
              color #f01414
              margin-right 8px
            .old
              font-size 10px
              text-decoration line-through

  /*.goods_right*/
</style>
