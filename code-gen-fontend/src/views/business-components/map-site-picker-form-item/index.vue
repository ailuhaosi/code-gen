<template>
  <div class="container">
    <div class="input-box">
      <el-input
        v-model="curLocation.lat"
        class="input-item"
        :disabled="true"
      />
      <el-input
        v-model="curLocation.lng"
        class="input-item"
        :disabled="true"
      />
    </div>
    <div class="btn-box">
      <el-button
        type="primary"
        @click="dialogMapVisible = true"
      >选择坐标</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogMapVisible"
      v-if="dialogMapVisible"
      append-to-body
    >
      <CustomizeMap
        ref="CustomizeMapRef"
        :curLocation="curLocation"
      />
      <el-button @click="onSubmit('cancel')">取消</el-button>
      <el-button
        type="primary"
        @click="onSubmit('ok')"
      >确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import eq from 'lodash/eq';
import cloneDeep from 'lodash/cloneDeep'
import CustomizeMap from "@/components/CustomizeMap"
export default {
  name: "MapSitePickerFormItem",
  components: {
    CustomizeMap
  },
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
      syncFormData: {},
      curLocation: { lng: '', lat: '' },// lng: 116.404, lat: 39.915
      dialogMapVisible: false
    }
  },
  watch: {
    formData: {
      handler (newVal, oldVal) {
        if (!eq(newVal, this.syncFormData)) {
          this.$set(this, "syncFormData", newVal);
          this.curLocation = this.transFormItemDataToMapSiteVal(newVal);
          //this.syncFormData = newVal;//引用传递;修改子组件表单会自动同步父组件中formData的值//会破坏单向数据流不要用
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    transFormItemDataToMapSiteVal (formData) {

      if (formData[this.formItemKey]?.lat && formData[this.formItemKey]?.lng) {
        return { ...formData[this.formItemKey] }
      } else {
        return { lng: '', lat: '' }
      }
    },
    onSubmit (flag) {
      if (flag === 'ok') {
        //console.log('新值===', this.$refs["CustomizeMapRef"].syncCurLocation);
        const newFormData = { ...this.syncFormData };
        newFormData[this.formItemKey] = this.$refs["CustomizeMapRef"].syncCurLocation;
        this.$emit("update:form-data", newFormData);
      }
      this.dialogMapVisible = false;
    }
  },
  created () {
    //console.log("表单数据", this.formData, this.formItemKey, this.componentAttr)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
}
.input-box {
  flex: 1 0 100px;
}
.input-box .input-item {
  display: inline-flex;
  width: 45%;
  margin-right: 10px;
}
.btn-box {
  flex: 0 0 auto;
}
</style>