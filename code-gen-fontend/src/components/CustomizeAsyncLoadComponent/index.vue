<template>
  <div ref="CustomizeAsyncLoadRef"></div>
</template>
<script>

import Vue from "vue";
//TODO:需要考虑自定义组件 修改传入的formData时触发事件;自定义组件的events应该也是动态传入的
export default {
  name: "CustomizeAsyncLoad",
  props: {
    /**
     * componentFilePath 必须属于 @/views/ 路径下面的子路径
     */
    componentFilePath: {
      type: String,
      require: true
    },
    componentProps: {
      type: Object,
      require: true
    }
  },
  methods: {
    /**
     * webpack4 中 import动态导入传变量无效;且推荐路径精准,即使用前缀@/views/,因为webpack使用正则遍历依赖.
     * 参考:https://blog.csdn.net/c19910323/article/details/106754307
     */
    registerComponent () {
      //return import(`@/views/${this.componentFilePath}`)
      return Promise.resolve(require(`@/views/${this.componentFilePath}`))
    },
    startDynmicLoadComponent () {
      this.registerComponent().then(component => {
        const cpt = Vue.extend(component.default);
        new cpt({
          el: this.$refs["CustomizeAsyncLoadRef"],
          propsData:{
            componentProps:this.componentProps
          }
        });
      }).catch(err => {
        console.log(err)
      });
    },
  },
  created () {
    this.startDynmicLoadComponent()
  }
}
</script>
<style></style>