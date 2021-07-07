<template>
  <div>
    <FilterFormTableModalComponent class="filter-form-table-modal-component" />
  </div>
</template>

<script>
import {
  FilterFormTableModal,
  mapKeysToTarget,
  cloneDeep
} from "filter-form-table-modal/packages";
// 按钮权限控制
import { checkBtnPermission } from "@/utils/permission";

const myFilterFormTableModal = FilterFormTableModal({ checkBtnPermission });

import { ComponentsAttrsDialogFormMixins } from "./ComponentsAttrsDialogFormMixins";

import { componentOptions } from "./constants";
export default {
  name: "CodegenComponentConfiger",
  props: {
    componentConfigs: {
      type: Array
      //default: () => ({ "table-name": "tb_region" }),
    },
    curTabType: {
      type: String,
      default: "FormAboveTableConfig"
    }
  },
  components: {},
  mixins: [myFilterFormTableModal, ComponentsAttrsDialogFormMixins],
  data() {
    return {
      /**
       * 表格上方的表单 相关数据开始
       * */
      //formAboveTableCanToggledShowStatusOverIdx: 4, //formItemMetaListAboveTable中索引>=4的统统隐藏
      formItemMetaListAboveTable: [],
      /**
       * 表格上方的表单 相关数据结束
       * */
      // ///////////////
      /**
       * 表格 相关数据开始
       * */
      tableCommonAttr: { "row-key": "column-name" },
      tableColMetaData: [
        {
          colType: "selection",
          key: "multi-selection",
          width: "55",
          isShow: true
        },
        { type: "SerialNum", key: "serial-num", label: "序号", width: "100" },
        {
          type: "Select",
          key: "sort",
          label: "调整序号到目标之前",
          width: "150",
          options: [],
          events: (rowIdx, colIdx, colKey) => {
            return {
              change: val => {
                console.log(rowIdx, colIdx, colKey, val);
                if (rowIdx + 2 === val) {
                  return;
                } else {
                  const tableBodyDataCloned = cloneDeep(this.tableBodyData);
                  const curRowData = tableBodyDataCloned[rowIdx];
                  tableBodyDataCloned.splice(rowIdx, 1);
                  // 区分 往后移 还是 往前移
                  const addTargetIdx = rowIdx + 1 < val ? val - 2 : val - 1;
                  tableBodyDataCloned.splice(addTargetIdx, 0, curRowData);
                  tableBodyDataCloned.map((el, idx) => {
                    el.sort = idx + 1;
                    return el;
                  });
                  this.tableBodyData = tableBodyDataCloned;
                }
              }
            };
          }
        },
        { type: "Text", key: "column-name", label: "列名" },
        { type: "Text", key: "data-type", label: "类型" },
        { type: "Text", key: "is-primary", label: "是否主键" },
        {
          type: "Input",
          key: "component-label",
          label: "组件label",
          width: "150"
        },
        {
          type: "Select",
          key: "component-type",
          label: "组件类型选择",
          width: "200",
          options: []
        },
        {
          type: "MultiComponents",
          key: "table-operations-block",
          label: "操作",
          width: "350",
          componentList: [],
          isShow: true
        }
      ]
      /**
       * 表格 相关数据结束
       * */
      // //////////////////////
      /**
       * 弹窗表单 相关数据开始
       */
      /**
       * 弹窗表单 相关数据结束
       */
    };
  },
  watch: {
    /* 设置表格的绑定值，并设置排序这一列数据 */
    componentConfigs: {
      handler(newVal, oldVal) {
        this.tableBodyData = newVal.map((el, idx) => {
          el.sort = idx + 1;
          return el;
        });
        this.$set(this.pageObj, "total", newVal.length);
        this.setTableColMetaDataSortOptions();
      },
      immediate: true,
      deep: true
    },
    /* 设置对应tab下的表格中组件类型这一列的下拉组件的options */
    curTabType: {
      handler(newVal, oldVal) {
        const curTabConfigComponentName =
          this.curTabType.indexOf("Form") === -1 ? "Table" : "Form";
        const componentTypeColMetaData = this.tableColMetaData.find(
          el => el.key === "component-type"
        );
        console.log(curTabConfigComponentName, "======---------");
        this.$set(
          componentTypeColMetaData,
          "options",
          componentOptions.filter(el =>
            [curTabConfigComponentName, "All"].includes(el.applyTo)
          )
        );
      },
      immediate: true
    }
  },
  methods: {
    setTableColMetaDataSortOptions() {
      const targetColMetaData = this.tableColMetaData.find(
        el => el.key === "sort"
      );
      const sortColumnOptions = this.tableBodyData.map((el, idx) => ({
        label: idx + 1,
        value: idx + 1
      }));
      this.$set(targetColMetaData, "options", sortColumnOptions);
    },
    /**
     * 获取增删改查的函数名
     * @param {string} curdType "Save"、"Delete"、"Update"、"GetList"、"GetInfo"
     * @returns {string} 函数名
     *  */
    getBussinessCurdMethodName(curdType) {
      const allCurdMethodNames = {
        //Save: saveRegion,
        //Delete: deleteRegionByIds,
        //Update: updateRegion,
        GetList: async () => {
          return Promise.resolve({ code: -1 });
        }
        //GetInfo
      };
      return allCurdMethodNames[curdType];
    },
    /**
     * 获取当前页面按钮的权限
     * @param {string} btnType "Search"、"Save"、"Update"、"Delete"
     * @returns {string} 对应后端的权限
     *  */
    getBussinessBtnPerms(btnType) {
      const allBtnPerms = {
        Search: "biz:table:list",
        Save: "biz:region:save",
        Update: "biz:region:update",
        Delete: "biz:region:delete"
      };
      return allBtnPerms[btnType];
    },
    ////////////////////////////////////
    /**
     * 核心函数介绍:
     *
     * 1. 事件触发源：getAppend···BlockComponents 函数内定义了组件元数据,是事件的触发源
     *
     * 2. 事件处理端：get···EventStrategy 函数内定义了 触发源传过来的事件的具体处理逻辑
     *    EventStrategy 函数会根据触发源中不同事件策略命名 分发到不同的 事件策略函数中
     */
    ////////////////////////////////////
    /**
     * 表格上方的表单 的 按钮等组件;默认已存在展开、重置、查询、添加、批量删除等按钮
     * 如果直接使用内置组件不改动，则直接返回null 或 undefined即可
     * "form-more-above-table"、"form-reset-above-table"、"form-search-above-table"、"form-add-above-table"、"form-batch-delete-above-table"
     * componentMetaDataArr: 按次序排按钮的key;若不需要自带的重置按钮,可以用占位符替代
     * data表示待插入的按钮组件的元数据;其中每个data对应为数组的占位符
     *  */
    getAppendFooterBlockComponentsAboveTable(emitTarget = "FormAboveTable") {
      //return null;
      return {
        componentKeysArr: [
          "form-more-above-table"
          //"form-reset-above-table",
          //"form-search-above-table"
          //"form-add-above-table",
          //"form-batch-delete-above-table",
          //"$",
        ],
        componentMetaDataArr: []
      };
    },
    /**
     * 表格内部 的 行操作按钮等组件;默认已存在编辑、删除等按钮
     * 如果直接使用内置组件不改动，则直接返回null 或 undefined即可
     * "table-edit-btn"、"table-delete-btn"
     * componentMetaDataArr: 按次序排按钮的key;若不需要自带的重置按钮,可以用占位符替代
     * data表示待插入的按钮组件的元数据;其中每个data对应为数组的占位符
     *  */
    getAppendTableOperationsBlockComponents(emitTarget = "Table") {
      //return null;
      return {
        componentKeysArr: [
          "table-edit-component-attrs-btn" //"table-edit-btn",
          //"table-delete-btn",
        ],
        componentMetaDataArr: [
          {
            type: "Button", // 可不填,默认是按钮
            key: "table-edit-btn",
            componentAttr: {
              type: "warning",
              textVal: "编辑组件属性",
              size: "small"
            },
            curRowAttr: (row, rowIdx) => {
              let attrObj = {};
              if (row["component-type"] === "Hidden") {
                attrObj.disabled = true;
              } else {
                attrObj.disabled = false;
              }
              return attrObj;
            },
            events: (rowIdx, colIdx, colKey, ...data) => {
              return {
                click: () => {
                  console.log(rowIdx, colIdx, colKey);
                  // 将当前行的 row["component-attr"] 下的所有属性赋值给弹窗表单

                  this.mixins_emitEventStrategy(
                    emitTarget,
                    "EditRowComponentAttrsDialogFormOpen",
                    rowIdx,
                    colIdx,
                    colKey,
                    ...data
                  );
                }
              };
            }
          }
        ]
      };
    },
    ////////////////////////////////////
    // 写请求接口,最常用的三个函数 getDialogTipOpenEventStrategy、getDialogFormOpenEventStrategy、getDialogFormValidSubmitEventStrategy
    ////////////////////////////////////
    /**
     * @param {string} strategyName 策略名
     * @param {int | null} pickedRowIdx 表格的行idx;如果不是表格打开的则为null
     * @param {array} args args数组分以下两种情况
     * 1. 来自其他打开情况：`pickedRowIdx=···`; `eventFromKey=${args[0]};用户自定义传入的数据是否存在=${args.length>1};`
     * 2. 来自表格打开情况：`pickedRowIdx=null`; `colIdx=${args[0]};colKey=${args[1]};multiComponentIdx=${args[2]};用户自定义传入的数据是否存在=${args.length>3};`
     *
     * DialogTipOpen 点击确认按钮后触发的事件策略
     *
     * 通常这里写表单"Delete"等请求接口
     * 触发提示操作的按钮 被点击后，出现提示框，并点击确认时执行的策略;即 策略名 以 "DialogTipOpen"结尾
     *
     * 如，删除按钮，弹框确认后，执行删除请求
     */
    getDialogTipOpenEventStrategy(strategyName, pickedRowIdx, args) {
      const strategys = {};
      return strategys;
    },
    /**
     * @param {string} strategyName 策略名
     * @param {int | null} pickedRowIdx 表格的行idx;如果不是表格打开的则为null
     * @param {array} args args数组分以下两种情况
     * 1. 来自其他打开情况：`pickedRowIdx=···`; `eventFromKey=${args[0]};用户自定义传入的数据是否存在=${args.length>1};`
     * 2. 来自表格打开情况：`pickedRowIdx=null`; `colIdx=${args[0]};colKey=${args[1]};multiComponentIdx=${args[2]};用户自定义传入的数据是否存在=${args.length>3};`
     *
     * DialogFormOpen 弹窗(表单)出现前的事件策略
     *
     * 通常这里写 表单详情获取"Get"等请求接口
     * 触发模态(表单、表格)操作的按钮 被点击后，执行的策略;即 策略名 以 "DialogFormOpen"结尾
     *
     * 如，编辑按钮点击后，出现弹窗表单之前，需要初始化表单的元数据 和 表单值绑定数据等逻辑
     */
    getDialogFormOpenEventStrategy(strategyName, pickedRowIdx, args) {
      const strategys = {
        EditRowComponentAttrsDialogFormOpen: async () => {
          this.dialogFormItemMetaList =
            this?.[
              `mixins_${
                this.tableBodyData[pickedRowIdx]["component-type"]
              }AttrDialogFormItemMetaList`
            ] ?? [];
          this.dialogFormData =
            this.tableBodyData[pickedRowIdx]?.["component-attr"] ?? {};
        }
      };
      return strategys;
    },
    /**
     * @param {string} strategyName 策略名
     * @param {int | null} pickedRowIdx 表格的行idx;如果不是表格打开的则为null
     * @param {array} args args数组分以下两种情况
     * 1. 来自其他打开情况：`pickedRowIdx=···`; `eventFromKey=${args[0]};用户自定义传入的数据是否存在=${args.length>1};`
     * 2. 来自表格打开情况：`pickedRowIdx=null`; `colIdx=${args[0]};colKey=${args[1]};multiComponentIdx=${args[2]};用户自定义传入的数据是否存在=${args.length>3};`
     *
     * DialogFormOpen 弹窗(表单)出现后的准备提交表单的事件策略
     *
     * 通常这里写表单提交"Post"等请求接口
     *
     * 策略名 以 "DialogFormOpen"结尾 的 事件 经过 `getDialogFormOpenEventStrategy` 处理后,点击提交按钮时的逻辑
     *
     * 如,新增按钮 弹窗后 填完表单 点击提交按钮时 需要先校验表单,再执行请求;表单校验逻辑不需要,只需要写请求逻辑即可
     */
    getDialogFormValidSubmitEventStrategy(strategyName, pickedRowIdx, args) {
      const strategys = {
        EditRowComponentAttrsDialogFormOpen: async () => {
          this.$set(
            this.tableBodyData[pickedRowIdx],
            "component-attr",
            this.dialogFormData
          );
        }
      };
      return strategys;
    },
    ////////////////////////////////////
    // 复杂自定义组件,最常用的三个函数 getFormCustomizeEventStrategyAboveTable、getTableCustomizeEventStrategy、getDialogFormCustomizeEventStrategy
    ////////////////////////////////////
    /**
     * @param {string} strategyName 策略名
     * @param {array} args args数组 `eventFromKey=${args[0]};用户自定义传入的数据是否存在=${args.length>1};`
     *
     * 表格上方Form组件的Customize事件策略
     *
     * 表格上方表单项执行的策略;除了 弹窗(表单)、弹框提示,即 策略名 以 "DialogFormOpen"、"DialogTipOpen"结尾的除外的所有事件都在这里
     *
     * 如，某些自定义表单项组件的事件;通过 `this.$emit()` 传递到 模板中的 `@do-operation="mixins_doFormAboveTableEventStrategy(arguments)"` 进而 发送到这里执行
     *
     * 有两种方式触发到这里:
     * 1. 在其他vue文件里;封装的组件内通过 `this.$emit()`
     * 2. 在当前vue文件里的组件meta数据中的事件回调中 使用 this.mixins_emitEventStrategy("FormAboveTable", eventStrategyName, ...args);
     */
    getFormCustomizeEventStrategyAboveTable(strategyName, args) {
      const strategys = {};
      return strategys;
    },
    /**
     * @param {string} strategyName 策略名
     * @param {array} args args数组 `pickedRowIdx=···`; `colIdx=${args[0]};colKey=${args[1]};multiComponentIdx=${args[2]};用户自定义传入的数据是否存在=${args.length>3};`
     *
     * 表格内部的Customize事件策略
     *
     * 表格 执行的策略;除了 弹窗(表单)、弹框提示,即 策略名 以 "DialogFormOpen"、"DialogTipOpen"结尾的除外的所有事件都在这里
     *
     * 如，某些自定义表格项组件的事件;通过 `this.$emit()` 传递到 模板中的 `@do-operation="mixins_doTableEventStrategy(arguments)"` 进而 发送到这里执行
     *
     * 有两种方式触发到这里:
     * 1. 在其他vue文件里;封装的组件内通过 `this.$emit()`
     * 2. 在当前vue文件里的组件meta数据中的事件回调中 使用 this.mixins_emitEventStrategy("Table", eventStrategyName, ...args);
     */
    getTableCustomizeEventStrategy(strategyName, pickedRowIdx, args) {
      //console.log(`strategyName=${strategyName};rowIdx=${args[0]};colIdx=${args[1]};colKey=${args[2]};multiComponentIdx=${args[3]};用户自定义传入的数据是否存在=${args.length>4};`)
      const strategys = {};
      return strategys;
    },
    /**
     * @param {string} strategyName 策略名
     * @param {array} args args数组 `eventFromKey=${args[0]};用户自定义传入的数据是否存在=${args.length>1};`
     *
     * 弹窗表单的Customize事件策略
     *
     * 弹窗表单打开后,如果表单里面有自定义事件,写在下面;除了 以 "DialogFormOpen" 结尾的 策略
     *
     * 如，弹窗某些自定义表单项组件的事件;通过 `this.$emit()` 传递到 模板中的 `@do-operation="mixins_doDialogFormEventStrategy(arguments)"` 进而 发送到这里执行
     *
     * 有两种方式触发到这里:
     * 1. 在其他vue文件里;封装的组件内通过 `this.$emit()`
     * 2. 在当前vue文件里的组件meta数据中的事件回调中 使用 this.mixins_emitEventStrategy("DialogForm", eventStrategyName, ...args);
     *  */
    getDialogFormCustomizeEventStrategy(strategyName, args) {
      const strategys = {};
      return strategys;
    }
  }
};
</script>

<style scoped>
.filter-form-table-modal-component /deep/ .form-above-table {
  margin-top: 50px;
}

/* 表单的不同item项，需要在同一行 */
.filter-form-table-modal-component
  /deep/
  .form-above-table
  /deep/
  .el-form-item {
  width: 400px;
  display: inline-block;
}

.filter-form-table-modal-component
  /deep/
  .form-above-table
  /deep/
  .el-form-item
  .el-form-item__content {
  width: 350px;
}

.filter-form-table-modal-component
  /deep/
  .form-above-table
  /deep/
  .el-form-item
  .el-form-item__content
  > div {
  width: calc(140% - 250px);
}

/* 左右布局比例 */
/* 仅当formAboveTable右边有三个按钮时的布局;右边得加宽不然放不下三个按钮 */
.filter-form-table-modal-component
  /deep/
  .form-above-table.form-above-table-layout
  /deep/
  .common-form-container
  .form-content-box {
  width: calc(100% - 300px);
}
.filter-form-table-modal-component
  /deep/
  .form-above-table.form-above-table-layout
  /deep/
  .common-form-container
  .default-btns-box {
  width: 300px;
}
</style>
