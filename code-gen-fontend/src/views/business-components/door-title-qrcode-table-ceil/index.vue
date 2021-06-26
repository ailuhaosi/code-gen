<template>
  <div class="container">
    <span style="max-width:150px;overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ syncRowData['door-title'] }}</span>
    <el-popover
      v-if="syncRowData['door-qrcode']"
      placement="right"
      trigger="hover"
      width="150"
      style="display:flex;text-align:center;"
    >
      <img
        :src="$global['BASE_URL']+qrcodeUrl"
        alt=""
        style="max-width:100px;margin-left:10px;"
      >
      <template v-slot:reference>
        <img
          :src="require('../../../assets/images/qrcode-icon.png')"
          alt=""
          style="height:20px;margin-top:5px;"
        >
      </template>
    </el-popover>

  </div>
</template>

<script>
import eq from 'lodash/eq'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'TagChainTableCeil',
  props: {
    /**
     * 如果有 , 则说明是 type='MultiComponents'
     *   */
    tableCeilKey: {
      type: String,
      require: true
    },
    componentAttr: {
      type: Object
      // require: true
    },
    rowData: {
      type: Object,
      require: true
    },
    rowIdx: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      syncRowData: []
    }
  },
  computed: {
    qrcodeUrl() {
      const qrcode = this.syncRowData['door-qrcode'] || this.syncRowData['visit-qrcode']
      return qrcode
    }
  },
  watch: {
    rowData: {
      handler(newVal, oldVal) {
        if (!eq(newVal, this.syncRowData)) {
          this.$set(this, 'syncRowData', newVal)
          // this.syncFormData = newVal;//引用传递;修改子组件表单会自动同步父组件中formData的值//会破坏单向数据流不要用
        }
      },
      immediate: true,
      deep: true
    },
    syncRowData: {
      handler(newVal, oldVal) {
        // TODO:FIXME: 防止死循环;表格单元格编辑另考虑
        // this.$emit("update:row-data", newVal)
      },
      deep: true
    }
  },
  created() {
    // console.log("表格数据", this.rowData, this.tableCeilKey, this.rowIdx)
  },
  methods: {
    /* onInputBlur (event, keyName) {
      //复杂事件逻辑
      this.$emit("do-operation", 'InputChainOperation', `${this.formItemKey},${keyName}`);
    } */
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-box {
  flex: 1 0 100px;
}
.chain-space {
  margin-right: 10px;
}

.err-tip {
  color: red;
}
</style>
