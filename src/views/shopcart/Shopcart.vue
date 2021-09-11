<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar @buy="buy"></cart-bottom-bar>
    <toast :message="message" :show="show"></toast>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import {mapGetters} from 'vuex'
import CartList from "./CartList"
import CartBottomBar from './CartBottomBar.vue';
import Toast from '../../components/common/toast/Toast.vue';
export default {
  components: { NavBar,CartList, CartBottomBar, Toast},
  name: "Shopcart",
  data(){
   return {
     message:'当前购物车为空',
     show:false
   }
  },
  computed:{
    ...mapGetters(['cartLength'])
  },
  methods:{
  buy(){
  this.show = true
  setTimeout(()=>{
    this.show = false
  },1500)
}
  }
};
</script>

<style>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
.cart{
  height: 100vh;
}
</style>
