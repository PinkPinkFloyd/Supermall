<template>
  <div class="toast" v-show="show">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
name:"Toast",
props:{
  message:{
    type:String,
    default:''
  },
  show:{
    type:Boolean,
    default:false
  }
}
}
</script>

<style>
.toast{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background-color: rgb(0, 0, 0,.75);
  padding: 8px 10px;
  color: #fff;
}
</style>