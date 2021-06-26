<template>
  <div class="container">
    <div class="input-chain-box">
      <template v-for="(item, idx) in syncKeyValMappingList">
        <div class="input-item-box" :key="idx">
          <el-input
            class="input-item"
            v-model="syncKeyValMappingList[idx].key"
            :placeholder="
              formItemKey === '_options' ? '请输入label' : '请输入映射后的值'
            "
            @blur="onBlurInput(idx)"
          />
          <el-input
            class="input-item"
            v-model="syncKeyValMappingList[idx].value"
            type="number"
            :placeholder="
              formItemKey === '_options'
                ? '请输入value'
                : '请输入value'
            "
            @blur="onBlurInput(idx)"
          />
          <el-button @click="deleteInputComp(idx)">删除</el-button>
        </div>
      </template>
    </div>
    <div class="btn-box">
      <el-button @click="addInputComp">新增</el-button>
    </div>
  </div>
</template>

<script>
import eq from "lodash/eq";
import cloneDeep from "lodash/cloneDeep";
/**
 * 此组件接收 逗号分割的字符串,转换为多个input
 */
export default {
  name: "InputChainFormItem",
  props: {
    formItemKey: {
      type: String,
      require: true
    },
    componentAttr: {
      type: Object
      //require: true
    },
    formData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      syncFormData: {},
      syncKeyValMappingList: [],
      errMsg: {}
    };
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        if (!eq(newVal, this.syncFormData)) {
          this.$set(this, "syncFormData", newVal);
          this.syncKeyValMappingList = this.transFormItemDataToKeyValMappingList(
            newVal
          );
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onBlurInput(idx) {
      console.log(this.syncKeyValMappingList[0].key, "==============");
      if (this.syncKeyValMappingList.some(el => el.key === "")) {
        return;
      }
      //1 更新父亲
      const newFormData = cloneDeep(this.syncFormData);
      newFormData[
        this.formItemKey
      ] = this.transKeyValMappingListToFormItemData();
      this.$emit("update:form-data", newFormData);
    },
    addInputComp() {
      if (this.syncKeyValMappingList.some(el => el.key === "")) {
        return;
      }
      this.syncKeyValMappingList.push({ key: "", value: "" });
    },
    deleteInputComp(idx){
      this.syncKeyValMappingList.splice(idx, 1);
      this.onBlurInput(idx);
    },
    //将传入的formData,转换成组件内部的key-value
    transFormItemDataToKeyValMappingList(formData) {
      if (!formData[this.formItemKey]) {
        return [];
      }
      if (this.formItemKey === "_options") {
        return formData[this.formItemKey].map(el => ({
          key: el.label,
          value: el.value
        }));
      }
      if (this.formItemKey === "_matchMapObj") {
        const keys = Object.keys(formData[this.formItemKey].value);
        return keys.map(key => ({
          key: formData[this.formItemKey].value[key],
          value: key
        }));
      }
    },
    //将组件内部的key-value,转换成formData
    transKeyValMappingListToFormItemData() {
      if (!this.syncKeyValMappingList.length) {
        return undefined;
      }
      if (this.formItemKey === "_options") {
        return this.syncKeyValMappingList.map(el => ({
          label: el.key,
          value: el.value
        }));
      }
      if (this.formItemKey === "_matchMapObj") {
        const obj = {};
        this.syncKeyValMappingList.forEach(el => {
          obj[el.value] = el.key;
        });
        const matchMapObj = { value: obj, _default: "" }; //注意javadefault是关键字
        return matchMapObj;
      }
    }
  },
  created() {
    //console.log("表单数据", this.formData, this.formItemKey, this.componentAttr)
  }
};
</script>

<style scoped>
.container {
  display: inline-block;
}
.input-chain-box {
  min-width: 100%;
  margin-bottom: -10px; /* 1 */
  display:block;
}
.input-item-box {
  width: 450px;
  margin-right: 10px;
  margin-bottom: 10px; /* 1 */
  display: flex;
  float: left;
}
/* 去掉自定义组件 校验后 官方加入的 错误校验样式 */
.input-item-box /deep/ .el-input__inner {
  border-color: #dcdfe6 !important;
}
.input-item-box .input-item {
  margin-right:10px;
}
.input-item-box .input-item /deep/ .el-input-group__append {
  background: #fff;
  max-width: 10px;
  border: none;
  padding-right: 10px;
  padding-left: 0;
  margin-right: 20px;
}
.input-item-box .input-delete-icon {
  /* display: inline-block; */
  float: right;
  /* margin-left: -50px; */
  /* margin-top: -20px; */
  cursor: pointer;
  color: red;
  height: 100%;
  margin-right: 10px;
  /* border: 0.5px solid red;
  border-radius: 50%; */
  font-size: 8px !important;
}
.btn-box {
  min-width: 100%;
  display: flex;
}
</style>
