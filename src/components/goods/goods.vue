<template>
  <div>
    <div class="goods-wrapper">
      <div class="menu-wrapper" ref="menu_scroll">
        <ul>
          <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}"
              @click="selectIndex(index,$event)">
            <span class="text border-1px"><left-icon v-show="item.type>0" :size="3" :index="item.type"></left-icon>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="food-wrapper" ref="food_scroll">
        <ul>
          <!--添加一个hook标记，来查询位置-->
          <li v-for="(item,index) in goods" :key="index" class="food-item food-list-hook">
            <div class="food-name">{{item.name}}</div>
            <div class="food-content border-1px" v-for="(food,foodIndex) in item.foods" :key="foodIndex">
              <div class="food-img">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="food-text">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="sell-count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
              </div>
              <cartcontrol></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <shopcart :minPrice="seller.minPrice" :deliveryPrice="seller.deliveryPrice"></shopcart>
  </div>
</template>

<script>
  import leftIcon from '@/components/leftIcon/leftIcon'
  import shopcart from '@/components/shopcart/shopcart'
  import cartcontrol from '@/components/cartcontrol/cartcontrol'

  //  引入better-scroll
  import BScroll from 'better-scroll'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'left-icon': leftIcon,
      shopcart,
      cartcontrol
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        // 记录scrollY
        scrollY: 0,
        clientType: 'mobile'
      }
    },
    created() {
      this.$http.get('/api/goods')
        .then(res => {
          this.goods = res.data.data
          //  请求成功后，开始初始化滚动列表
          this.$nextTick(() => {
            this._initScroll()
            //  计算高度，将每段的高度记录到数组中。来做两遍的滚动的同步
            this._calculateHeight()
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    computed: {
      currentIndex() {
        //  计算当前的index
        for (let i = 0; i < this.listHeight.length; i++) {
          let lastHeight = this.listHeight[i]
          let nextHeight = this.listHeight[i + 1]
          //  判断当前的落在的区域
          if (!nextHeight || (this.scrollY >= lastHeight && this.scrollY < nextHeight)) {
            return i
          }
        }
        return 0
      }
    },
    mounted() {

    },
    methods: {
      _initScroll() {
        console.log('_initScroll')
        //  need pass dom object to init scroll
        this.menuScroll = new BScroll(this.$refs.menu_scroll, {
          click: true
        })

        //  需要记录scrollY.
        this.foodScroll = new BScroll(this.$refs.food_scroll, {
          probeType: 3
        })

        //  指定probeType之后，监听滚动事件
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        //  进行dom查询
        let foodList = this.$refs.food_scroll.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight = []
        //  第一个先将0，push进去
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let child = foodList[i]
          //  不断累加每个控件的高度，得到长度
          height += child.clientHeight
          //  push到list中
          this.listHeight.push(height)
        }
      },
      //  isPc() {
      //    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      //      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      //       // 移动端
      //      return "mobile"
      //    } else {
      //      return "pc"
      //    }
      //  },
      selectIndex(index, event) {
        // 如果没有这个变量的话，就是浏览器原生的事件
        if (!event._constructed) {
          return
        }
        console.log(index)
        // 因为我们的滚动需要滚动到事件，所以要根据这里的index，去找element
        // let foodList = this.$refs.food_scroll.getElementsByClassName('food-list-hook')
        //  console.log(event)
        //  this.$refs.food_scroll.scrollBy(scrollHeight)
        // let target = foodList[index]
        let scrollHeight = this.listHeight[index]
        this.foodScroll.scrollTo(0, -scrollHeight, 300)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .goods-wrapper
    position absolute
    top 176px
    bottom 48px
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
        &.current
          background: #fff
          font-weight 700
          z-index 10
          position relative
          margin-top -1px
          .text
            border-none()
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
            line-height 14px
            margin-bottom 8px
          .extra
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

</style>
