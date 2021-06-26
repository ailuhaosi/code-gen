<template>
  <v-region
    v-model="cityPickerVal"
    class="city-picker"
    :town="false"
    @values="changeCityPickerVal"
  />
</template>

<script>
import eq from 'lodash/eq'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'CityPickerFormItem',
  props: {
    formItemKey: {
      type: String,
      require: true
    },
    componentAttr: {
      type: Object
      // require: true
    },
    formData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      syncFormData: {},
      cityPickerVal: {
        province: null,
        city: null,
        area: null,
        town: null
      }
    }
  },
  computed: {
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        if (!eq(newVal, this.syncFormData)) {
          this.$set(this, 'syncFormData', newVal)
          this.cityPickerVal = this.transFormItemDataToCityPickerVal(newVal)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // console.log("表单数据", this.formData, this.formItemKey, this.componentAttr)
  },
  methods: {
    transFormItemDataToCityPickerVal(formData) {
      if (typeof formData[this.formItemKey] === 'object') {
        return { ...formData[this.formItemKey], town: null }
      } else {
        return {
          province: null,
          city: null,
          area: null,
          town: null
        }
      }
    },
    changeCityPickerVal(val) {
      // 1 更新父亲
      const newCityPickerVal = {
        'province': val.province?.key || null,
        'city': val.city?.key || null,
        'area': val.area?.key || null
      }
      const newFormData = cloneDeep(this.syncFormData)
      newFormData[this.formItemKey] = newCityPickerVal
      this.$emit('update:form-data', newFormData)
      // 2 再校验
      this.$nextTick(() => {
        this.$emit('trigger-validate-form', this.formItemKey)
      })
    }
  }
}
</script>

<style scoped>
.city-picker {
  width: 100%;
}
.city-picker /deep/ .v-dropdown-caller.rg-select {
  width: calc(100% / 3 - 10px);
  margin-right: 10px;
}

.city-picker /deep/ .rg-select__content {
  height: 36px;
  line-height: 36px;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.city-picker /deep/ .rg-select__el {
  height: 36px;
}
</style>
