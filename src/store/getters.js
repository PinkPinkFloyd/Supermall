// export default {
//   cartLength(state){
//     return state.cartList.length
//   },
//   list(state){
//   return state.cartList
//   }
// }
  
const getters = {
  cartList(state) {
    return state.cartList
  },
  cartLength(state, getters) {
    return getters.cartList.length
  }
}

export default getters