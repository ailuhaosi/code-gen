<template>
  <el-tabs
    type="border-card"
    stretch
    :value="curTabComponent"
    @tab-click="tabClick"
  >
    <el-tab-pane label="数据库表选择器" name="DatabaseTableSelector">
      <DatabaseTableSelector
        v-show="curTabComponent === 'DatabaseTableSelector'"
        @initFormDataAboveTable="getInitFormDataAboveTable"
      />
    </el-tab-pane>
    <el-tab-pane label="当前选中的表的列信息" name="DatabaseTableInfo">
      <DatabaseTableInfo
        v-show="curTabComponent === 'DatabaseTableInfo'"
        :initFormDataAboveTable="initFormDataAboveTable"
        @setConfigsToTarget="setConfigsToTarget(arguments)"
      />
    </el-tab-pane>
    <el-tab-pane label="待生成页面的搜索表单配置" name="FormAboveTableConfig">
      <CodegenComponentConfiger
        v-show="curTabComponent === 'FormAboveTableConfig'"
        :curTabType="'FormAboveTableConfig'"
        :componentConfigs="formAboveTableConfigs"
      />
    </el-tab-pane>
    <el-tab-pane label="待生成页面的表格配置" name="TableConfig">
      <CodegenComponentConfiger
        v-show="curTabComponent === 'TableConfig'"
        :curTabType="'TableConfig'"
        :componentConfigs="tableConfigs"
      />
    </el-tab-pane>
    <el-tab-pane label="待生成页面的弹窗表单配置" name="DialogFormConfig">
      <CodegenComponentConfiger
        v-show="curTabComponent === 'DialogFormConfig'"
        :curTabType="'DialogFormConfig'"
        :componentConfigs="dialogFormConfigs"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import DatabaseTableSelector from "@/views/code-gen/vue2-admin/components/database-table-selector";
import DatabaseTableInfo from "@/views/code-gen/vue2-admin/components/database-table-info";
import CodegenComponentConfiger from "@/views/code-gen/vue2-admin/components/codegen-component-configer";

export default {
  components: {
    DatabaseTableSelector,
    DatabaseTableInfo,
    CodegenComponentConfiger
  },
  data() {
    return {
      curTabComponent: "DatabaseTableSelector",
      initFormDataAboveTable: { "table-name": "" },
      ////////////////////////////////
      formAboveTableConfigs: [],
      tableConfigs: [],
      dialogFormConfigs: []
    };
  },
  methods: {
    getInitFormDataAboveTable(data) {
      this.initFormDataAboveTable = { "table-name": data };
    },
    tabClick(tab) {
      this.curTabComponent = tab.name;
    },
    setConfigsToTarget(args) {
      const [targetConfigs, data] = args; //浅拷贝引用
      console.log(targetConfigs, data, "收到了");
      this[targetConfigs] = data; //引用
    }
  }
};
</script>

<style></style>
