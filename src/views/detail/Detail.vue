<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-navbar"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="detail-content"
      ref="scroll"
      @scroll="contentScroll"
      :probeType="3"
    >
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detailInfo="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        :paramInfo="paramInfo"
        ref="params"
      ></detail-param-info>
      <detail-comment-info
        :comment-info="commentInfo"
        ref="commentInfo"
      ></detail-comment-info>
      <goods-list :goods="recommends" ref="recommends"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="showBack"></back-top>
    <detail-bottom-bar @addClick="addClick"></detail-bottom-bar>
    <toast :message="message"  :show="show"></toast>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "common/utils";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
import BackTop from "../../components/content/backTop/BackTop.vue";
import { mapActions } from "vuex";
import Toast from "../../components/common/toast/Toast.vue";
export default {
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Toast
  },
  name: "Detail",

  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      newRefresh: null,
      getThemeTopY: null,
      showBack: false,
      message: "",
      show: false,
    };
  },
  created() {
    //保存传入的iid
    //首先定义一个变量iid来接受路由的params方法传过来的iid，
    //其次调用axios的getDetail方法请求数据 
    this.iid = this.$route.params.iid;
    getDetail(this.iid).then(res => {
      const data = res.result;
      //获取顶部图片数据
      console.log(res);
      this.topImages = data.itemInfo.topImages;
      //获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      this.shop = new Shop(data.shopInfo);
      this.detailInfo = data.detailInfo;
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    getRecommend().then(res => {
      this.recommends = res.data.list;
    });
    // this.$nextTick(()=>{

    // })
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.commentInfo.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      console.log(this.themeTopYs);
    }, 500);
  },
  methods: {
    //映射vuex中的actions
    ...mapActions(["addcart"]),
    imageLoad() {
      this.newRefresh = debounce(() => {
        this.$refs.scroll.refresh;
      }, 500);
      this.newRefresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      const positionY = -position.y;
      if (positionY >= 0 && positionY < this.$refs.params.$el.offsetTop) {
        this.$refs.nav.currentIndex = 0;
      } else if (
        positionY >= this.$refs.params.$el.offsetTop &&
        positionY < this.$refs.commentInfo.$el.offsetTop
      ) {
        this.$refs.nav.currentIndex = 1;
      } else if (
        positionY >= this.$refs.commentInfo.$el.offsetTop &&
        positionY < this.$refs.recommends.$el.offsetTop
      ) {
        this.$refs.nav.currentIndex = 2;
      } else if (positionY >= this.$refs.recommends.$el.offsetTop) {
        this.$refs.nav.currentIndex = 3;
      }
      // if(positionY >= 1000){
      //   this.showBack = true
      // }else{
      //   this.showBack= false
      // }
      this.showBack = positionY > 1000;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    addClick() {
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // this.$store.dispatch('addcart',product).then(res =>{
      //   console.log(res);
      // })
      //提交addcart到vuex中的actions里
      //返回promise，做toast弹窗
      this.addcart(product).then(res => {
        this.show = true;
        this.message = res;
        setTimeout(()=>{
          this.show = false
        },1500)
      });
    },
    
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.$bus.$on("detailImageLoad", () => {
      refresh();
    });
  }
};
</script>

<style>
#detail {
  position: relative;
  z-index: 99;
  background-color: #fff;
  height: 100vh;
}
.detail-content {
  height: calc(100% - 44px - 49px);
}
.detail-navbar {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

</style>
