module.exports = {
  configureWebpack: {
    resolve: {
      // extensions:[] //这个属性可选，默认后缀名.json/.vue/.js文件引用时不需要加后缀名了，所以一般不设置这个
      alias: {
        //别名
        //  '@':'src'    //像之前引用的css文件@import 也是默认就有的，不需要再写这行代码
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
      },
    },
  },
};
