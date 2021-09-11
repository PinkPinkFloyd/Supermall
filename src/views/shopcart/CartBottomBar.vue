<template>
  <div class="cart-bottom-bar">
    <div class="check-all">
      <check-button class="check-button" :isChecked="isSelectAll" @click.native="select"></check-button>
    <span>全选</span>
    </div>
    <div class="totle">合计:{{totle}}</div>
    <div class="caculate" @click="buy">去计算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from './CheckButton.vue'
export default {
  components: { CheckButton },
name:"CartBottonBar",
computed:{
  totle(){
    return  "¥" + this.$store.state.cartList.filter(item =>{
      return item.checked
    }).reduce((preValue,item)=>{
      return preValue + item.price * item.count
    },0).toFixed(2)
  },
  checkLength(){
    return this.$store.state.cartList.filter(item =>{
      return item.checked
    }).length
  },
  isSelectAll(){
    if(this.$store.state.cartList.length === 0) return false 
    return !this.$store.state.cartList.find(item => !item.checked)
  }
},
methods:{
  select(){
    if(this.isSelectAll){
    this.$store.state.cartList.forEach(item => item.checked = false)
    }else{
      this.$store.state.cartList.forEach(item => item.checked = true)
    }
  },
  buy(){
    if(!this.$store.state.cartList.find(item => item.checked)){
    this.$emit('buy')
    }
  }
}
}
</script>

<style>
.cart-bottom-bar{
  height: 40px;
  background-color: #eee;
  bottom: 134px;
  position: relative;
  line-height: 40px;
  font-size: 14px;
  display: flex;
  z-index: 999;
}
.check-all{
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button{
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 3px;
}
.totle{
  margin-left: 5px;
  width: 100px;
}
.caculate{
  margin-left: 105px;
  background-color: pink;
  width: 70px;
  text-align: center;
  
}
</style>