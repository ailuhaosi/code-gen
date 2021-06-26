<template>
  <div class="container">
    <div class="input-box">
      <el-slider
        v-model="syncFormData[formItemKey]"
        :step="optionChainHack(componentAttr,['step'],1)"
        :show-stops="optionChainHack(componentAttr,['show-stops'],true)"
        :min="optionChainHack(componentAttr,['min'],0)"
        :max="optionChainHack(componentAttr,['max'],7)"
        :marks="optionChainHack(componentAttr,['marks'],undefined)"
      >
      </el-slider>

    </div>
    <!-- <div class="btn-box">
      <el-button type="primary">选择图片</el-button>
    </div> -->
  </div>
</template>

<script>
import eq from 'lodash/eq';
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "VoiceSliderFormItem",
  props: {
    formItemKey: {
      type: String,
      require: true
    },
    componentAttr: {
      type: Object,
      //require: true
    },
    formData: {
      type: Object,
      require: true
    }
    //TODO: events应该可以由外部传入,如果外部不传,则用内部的;且events每个子key都是用于对应的一个v-on;
    //注: 内部的子key必须与外部传入一致
  },
  data () {
    return {
      syncFormData: {}
    }
  },
  watch: {
    formData: {
      handler (newVal, oldVal) {
        if (!eq(newVal, this.syncFormData)) {
          this.$set(this, "syncFormData", newVal);
          //this.syncFormData = newVal;//引用传递;修改子组件表单会自动同步父组件中formData的值//会破坏单向数据流不要用
        }
      },
      immediate: true,
      deep: true
    },
    syncFormData: {
      handler (newVal, oldVal) {
        this.$emit("update:form-data", newVal)
      },
      deep: true
    },
  },
  methods: {
    onInputBlur () {
      //当需要校验自定义formItem组件时,可以手动调用
      this.$emit("trigger-validate-form", this.formItemKey);
    },
    ///////////工具函数/////////////////////
    /**
     * 可选链的hack: 判断obj.a.b.c 是否 不为 undefined 或 null 则返回,否则返回默认值
     * @param {object} obj 原始对象
     * @param {Array} attars 按层级次序的属性数组
     * @param {any} defaultVal 默认值
     * */
    optionChainHack (obj, attrs, defaultVal) {
      let curObj = { ...obj };
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        curObj = curObj?.[attr];
      }
      return curObj ?? defaultVal;
    },
  },
  created () {
    console.log("表单数据", this.formData, this.formItemKey, this.componentAttr)
  }
}
</script>

<style scoped>
.container {
  display: flex;
}
.input-box {
  flex: 1 0 100px;
  margin-right: 20px;
}
.btn-box {
  flex: 0 0 auto;
}
</style>