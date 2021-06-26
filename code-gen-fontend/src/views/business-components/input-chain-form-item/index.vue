<template>
  <div class="container">
    <div class="input-chain-box">
      <template v-for="(item,idx) in syncMobileList">
        <div class="input-item-box" :key="idx">
          <el-input
            :ref="'InputRef'+idx"
            class="input-item"
            :readonly="(typeof errMsg[`InputRef${idx}`]) !== 'string' && syncMobileList[idx]!=='' && Object.keys(errMsg).length>0"
            v-model="syncMobileList[idx]"
            @blur="onBlurInput(idx)"
          >
            <template slot="append">
              <i
                class="el-icon-circle-close input-delete-icon"
                @click="deleteInputComp(idx)"
              ></i>
            </template>
          </el-input>
          <div
            v-show="Object.keys(errMsg).length>0"
            style="display:inline-block;color:red;font-size:12px;"
          >{{(typeof errMsg[`InputRef${idx}`]) === 'string' ? errMsg[`InputRef${idx}`] : ''}}</div>

        </div>
      </template>
    </div>
    <div class="btn-box">
      <el-button @click="addInputComp">新增</el-button>
    </div>
  </div>
</template>

<script>
import eq from 'lodash/eq';
import cloneDeep from 'lodash/cloneDeep'
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
      type: Object,
      //require: true
    },
    formData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      syncFormData: {},
      syncMobileList: [''],
      errMsg: {}
    }
  },
  watch: {
    componentAttr: {
      handler (newVal, oldVal) {
        const keys = Object.keys(newVal?.triggeredErrTargets);
        if (keys.length > 0) {
          this.$set(this.errMsg, keys[0], newVal.triggeredErrTargets[keys[0]]);
        } else {
          const orgKeys = Object.keys(this.errMsg);
          if (orgKeys.length > 0) {
            this.$delete(this.errMsg, orgKeys[0]);
          }
        }
      },
      deep: true
    },
    formData: {
      handler (newVal, oldVal) {
        if (!eq(newVal, this.syncFormData)) {
          this.$set(this, "syncFormData", newVal);
          this.syncMobileList = this.transFormItemDataToMobileList(newVal);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onBlurInput (idx) {
      //1 更新父亲
      const newFormData = cloneDeep(this.syncFormData);
      newFormData[this.formItemKey] = this.syncMobileList.join(',');
      this.$emit("update:form-data", newFormData);
      //2 再校验
      // 必须延后校验,修复点击删除按钮的提示bug
      setTimeout(() => {
        this.$emit("trigger-validate-form", this.formItemKey);
      }, 200);
    },
    addInputComp () {
      if (this.syncMobileList.some(el => el === '') || Object.keys(this.errMsg).length>0) {
        this.$emit("trigger-validate-form", this.formItemKey);
        return;
      }
      this.syncMobileList.splice(0, 0, '');

      this.$nextTick(() => {
        this.$refs[`InputRef0`][0].focus()
      })
    },
    deleteInputComp (idx) {
      if (this.syncMobileList.length > 1) {
        this.syncMobileList.splice(idx, 1);
        const newFormData = cloneDeep(this.syncFormData);
        newFormData[this.formItemKey] = this.syncMobileList.join(',');
        this.$emit("update:form-data", newFormData);
        //2 再校验
        this.$nextTick(() => {
          this.$emit("trigger-validate-form", this.formItemKey);
        })
      }
    },
    //将传入的联系电话string,转换成array
    transFormItemDataToMobileList (formData) {
      const itemValSplit = formData[this.formItemKey].split(',');
      if (Array.isArray(itemValSplit) && itemValSplit.length > 0) {
        return itemValSplit
      } else {
        return ['']
      }
    }
  },
  created () {
    //console.log("表单数据", this.formData, this.formItemKey, this.componentAttr)
  },
}
</script>

<style scoped>
.container {
  display: flex;
}
.input-chain-box {
  max-width: 90%;
  margin-bottom: -10px; /* 1 */
}
.input-item-box {
  width: 150px;
  margin-right: 10px;
  margin-bottom: 10px; /* 1 */
  display: inline-block;
  float: left;
}
/* 去掉自定义组件 校验后 官方加入的 错误校验样式 */
.input-item-box /deep/ .el-input__inner {
  border-color: #dcdfe6 !important;
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
  max-width: 10%;
}
</style>