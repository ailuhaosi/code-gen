<template>
  <div>
    <customize-form
      ref="FormAboveTableRef"
      class="form-above-table"
      :class="mixins_formAboveTableLayout"
      :is-dialog-container="false"
      :form-common-attr="formCommonAttrAboveTable"
      :footer-block-components="footerBlockComponentsAboveTable"
      :form-item-meta-list="formItemMetaListAboveTable"
      :form-data="formDataAboveTable"
      @update:form-data="val => $set($data, 'formDataAboveTable', val)"
      @do-operation="mixins_doFormAboveTableEventStrategy(arguments)"
    />
    <customize-table
      ref="TableRef"
      :table-list-loading="false"
      :table-col-meta-data="tableColMetaData"
      :table-body-data="tableBodyData"
      :table-common-attr="tableCommonAttr"
      :page-obj="pageObj"
      @update:table-body-data="val => $set($data, 'tableBodyData', val)"
      @update:page-obj="val => $set($data, 'pageObj', val)"
      @do-operation="mixins_doTableEventStrategy(arguments)"
    />
    <customize-form
      ref="DialogFormRef"
      class="form-modal"
      :is-dialog-container="true"
      :dialog-type="dialogType"
      :dialog-form-visible="dialogFormVisible"
      :dialog-center="true"
      :form-common-attr="formCommonAttrModal"
      :footer-block-components="footerBlockComponentsModal"
      :form-item-meta-list="dialogFormItemMetaList"
      :form-data="dialogFormData"
      @update:dialog-form-visible="val => (dialogFormVisible = val)"
      @update:form-data="val => $set($data, 'dialogFormData', val)"
      @do-operation="mixins_doDialogFormEventStrategy(arguments)"
    >
      <template v-slot:dialogTitle>
        <div style="font-weight: 550">{{ dialogFormTitle }}</div>
      </template>
    </customize-form>
  </div>
</template>

<script>
import CustomizeForm from "@/components/CustomizeForm";
import CustomizeTable from "@/components/CustomizeTable";
import { FilterFormTableModal } from "@/mixins/FilterFormTableModal.js";
import {
  getDatabaseTableColumnInfoList,
  downloadSourceCode
} from "@/api/code-gen/database-table-selector.js";

import { cloneDeep } from "@/utils";
// 按钮权限控制
import { checkBtnPermission } from "@/utils/permission";

import { mapKeysToTarget } from "@/utils";

export default {
  name: "DatabaseTableInfo",
  props: {
    initFormDataAboveTable: {
      type: Object
      //default: () => ({ "table-name": "tb_region" }),
    }
  },
  components: {
    CustomizeForm,
    CustomizeTable
  },
  mixins: [FilterFormTableModal],
  data() {
    return {
      /**
       * 表格上方的表单 相关数据开始
       * */
      //formAboveTableCanToggledShowStatusOverIdx: 4, //formItemMetaListAboveTable中索引>=4的统统隐藏
      formItemMetaListAboveTable: [
        {
          label: "表名：",
          type: "Input",
          key: "table-name",
          componentAttr: { placeholder: "请输入表名" }
        }
      ],
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
        { type: "Text", key: "column-name", label: "列名" },
        { type: "Text", key: "data-type", label: "类型" },
        { type: "Text", key: "column-key", label: "列key" },
        { type: "Text", key: "extra", label: "extra" },
        { type: "Text", key: "column-comment", label: "列注释" },
        {
          type: "MultiComponents",
          key: "table-operations-block",
          label: "操作",
          width: "350",
          componentList: [],
          isShow: true
        }
      ],
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
      formAboveTableConfigs: [],
      tableConfigs: [],
      dialogFormConfigs: []
    };
  },
  watch: {
    initFormDataAboveTable: {
      handler(newVal, oldVal) {
        this.formDataAboveTable = newVal;
        this.mixins_getBussinessKeyList();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    download(url, data) {
      let body = document.getElementsByTagName("body")[0];
      let form = document.createElement("form");
      form.method = "POST";
      form.action = url;
      for (key in data) {
        let param = document.createElement("input");
        param.type = "hidden";
        param.name = key;
        param.value = data[key];
        form.appendChild(param);
      }
      body.appendChild(form);
      form.submit();
      body.removeChild(form);
    },
    /* 校验三个源码是否配置完整 */
    validSourceCodeConfig() {
      const validTargetConfigs = targetConfigsAlias => {
        // 校验三个配置的label是否填写
        const validLabelExists =
          this[targetConfigsAlias].length > 0 &&
          this[targetConfigsAlias].every(
            config =>
              (config["component-type"] !== "Hidden" &&
                config["component-label"] !== "") ||
              config["component-type"] === "Hidden"
          );
        if (!validLabelExists) {
          this.$message.warning(`${targetConfigsAlias}的label不能为空`);
        }
        // 校验表格配置是否选中主键
        const hasTablePrimaryKey =
          targetConfigsAlias !== "tableConfigs" ||
          (targetConfigsAlias === "tableConfigs" &&
            this[targetConfigsAlias].some(el => el["is-primary"]));

        if (!hasTablePrimaryKey) {
          this.$message.warning(`表格必须配置主键`);
        }
        return validLabelExists && hasTablePrimaryKey;
      };
      return [
        "formAboveTableConfigs",
        "tableConfigs",
        "dialogFormConfigs"
      ].every(validTargetConfigs);
    },
    pickedRowSetTargetCurRowAttr(
      row,
      rowIdx,
      curConfigsAlias = "formAboveTableConfigs"
    ) {
      const btnTextPrefix =
        curConfigsAlias === "formAboveTableConfigs"
          ? "搜索表单"
          : curConfigsAlias === "tableConfigs"
          ? "表格"
          : "弹窗表单";
      let attrObj = {};
      const hasPicked = this[curConfigsAlias].some(
        el => el["column-name"] === row["column-name"]
      );
      if (hasPicked) {
        attrObj.textVal = `${btnTextPrefix}-已选`;
        attrObj.type = "warning";
      } else {
        attrObj.textVal = `${btnTextPrefix}-未选`;
        attrObj.type = "primary";
      }
      return attrObj;
    },
    pickedRowSetTargetConfigs(curConfigsAlias, rowIdx) {
      const curRow = this.tableBodyData[rowIdx];
      const idxInConfigs = this[curConfigsAlias].findIndex(
        el => el["column-name"] === curRow["column-name"]
      );
      //console.log(curRow, idxInConfigs, "==============");

      if (idxInConfigs > -1) {
        this[curConfigsAlias].splice(idxInConfigs, 1);
      } else {
        const willPushConfig = {
          "attr-name": curRow["column-name"]
            .split("_")
            .map(el => el[0].toUpperCase() + el.substring(1))
            .join(""),
          attrname: curRow["column-name"]
            .split("_")
            .map((el, idx) => {
              const ret = idx === 0 ? el[0].toLowerCase() + el.substring(1) : el[0].toUpperCase() + el.substring(1);
              return ret;
            })
            .join(""),
          "column-name": curRow["column-name"],
          "data-type": curRow["data-type"],
          "is-primary": curRow["column-key"].indexOf("PRI") > -1,
          "component-key": curRow["column-name"].replace("_", "-"),
          "component-label": curRow["column-comment"],
          "component-attr":{},
          "component-type":
            curRow["column-key"].indexOf("PRI") > -1
              ? "Hidden"
              : curConfigsAlias === "tableConfigs"
              ? "Text"
              : "Input"
        };
        this[curConfigsAlias].push(willPushConfig);
      }
      this.$emit("setConfigsToTarget", curConfigsAlias, this[curConfigsAlias]);
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
        GetList: getDatabaseTableColumnInfoList
        //GetInfo: getRegionInfo
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
          "form-more-above-table",
          "form-reset-above-table",
          "form-search-above-table",
          //"form-add-above-table",
          //"form-batch-delete-above-table",
          "$"
        ],
        componentMetaDataArr: [
          {
            key: "form-download-sourcecode-above-table",
            type: "Button",
            operationBtnType: "multi-select-operation-btn",
            componentAttr: {
              type: "warning",
              textVal: "下载源码",
              icon: {
                class: "el-icon-delete",
                place: "left"
              }
            },
            events: eventFromKey => {
              return {
                click: async () => {
                  const isValidPass = this.validSourceCodeConfig();
                  if (isValidPass) {
                    this.mixins_emitEventStrategy(
                      emitTarget,
                      "DownloadSourceCodeDialogTipOpen",
                      eventFromKey
                    );
                  }
                }
              };
            }
          }
        ]
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
          //"table-edit-btn",
          //"table-delete-btn",
          "$",
          "$",
          "$"
        ],
        componentMetaDataArr: [
          {
            type: "Button", // 可不填,默认是按钮
            key: "table-row-form-above-table-config-btn",
            componentAttr: {
              type: "primary",
              textVal: "搜索表单-未选",
              size: "small"
            },
            curRowAttr: (row, rowIdx) => {
              return this.pickedRowSetTargetCurRowAttr(
                row,
                rowIdx,
                "formAboveTableConfigs"
              );
            },
            events: (rowIdx, colIdx, colKey, ...data) => {
              return {
                click: () => {
                  this.pickedRowSetTargetConfigs(
                    "formAboveTableConfigs",
                    rowIdx
                  );
                }
              };
            },
            isShow: checkBtnPermission(
              this,
              this.getBussinessBtnPerms("Delete")
            )
          },
          {
            type: "Button", // 可不填,默认是按钮
            key: "table-row-table-config-btn",
            componentAttr: {
              type: "primary",
              textVal: "表格-未选",
              size: "small"
            },
            curRowAttr: (row, rowIdx) => {
              return this.pickedRowSetTargetCurRowAttr(
                row,
                rowIdx,
                "tableConfigs"
              );
            },
            events: (rowIdx, colIdx, colKey, ...data) => {
              return {
                click: () => {
                  this.pickedRowSetTargetConfigs("tableConfigs", rowIdx);
                }
              };
            },
            isShow: checkBtnPermission(
              this,
              this.getBussinessBtnPerms("Delete")
            )
          },
          {
            type: "Button", // 可不填,默认是按钮
            key: "table-row-dialog-form-config-btn",
            componentAttr: {
              type: "primary",
              textVal: "弹窗表单-未选",
              size: "small"
            },
            curRowAttr: (row, rowIdx) => {
              return this.pickedRowSetTargetCurRowAttr(
                row,
                rowIdx,
                "dialogFormConfigs"
              );
            },
            events: (rowIdx, colIdx, colKey, ...data) => {
              return {
                click: () => {
                  this.pickedRowSetTargetConfigs("dialogFormConfigs", rowIdx);
                }
              };
            },
            isShow: checkBtnPermission(
              this,
              this.getBussinessBtnPerms("Delete")
            )
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
      const strategys = {
        DownloadSourceCodeDialogTipOpen: async () => {
          const bodyData = {
            "table-name": this.formDataAboveTable["table-name"],
            "gen-page-info": {
              type: "vue2-admin",
              componentConfig: {
                formAboveTableConfigs: mapKeysToTarget(
                  this.formAboveTableConfigs,
                  "BackEnd"
                ),
                tableConfigs: mapKeysToTarget(this.tableConfigs, "BackEnd"),
                dialogFormConfigs: mapKeysToTarget(
                  this.dialogFormConfigs,
                  "BackEnd"
                )
              }
            }
          };
          const res = await downloadSourceCode(
            mapKeysToTarget(bodyData, "BackEnd")
          );
          let blob = res;
          // 创建一个URL指向Blob，也就是Blob URL
          let url = window.URL.createObjectURL(blob);
          // 创建<a>标签
          let el = document.createElement("a");
          el.href = url;
          // 指定下载的文件名
          el.download = "source-code.zip";
          el.hidden = true;
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);

          /* this.download(
            "http://localhost/api/sys/generator/download-sourcecode",
            mapKeysToTarget(bodyData, "BackEnd")
          ); */
          console.log(res, strategyName, pickedRowIdx, args, "xxxxxxxxxxxxx");
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
     * DialogFormOpen 弹窗(表单)出现前的事件策略
     *
     * 通常这里写 表单详情获取"Get"等请求接口
     * 触发模态(表单、表格)操作的按钮 被点击后，执行的策略;即 策略名 以 "DialogFormOpen"结尾
     *
     * 如，编辑按钮点击后，出现弹窗表单之前，需要初始化表单的元数据 和 表单值绑定数据等逻辑
     */
    getDialogFormOpenEventStrategy(strategyName, pickedRowIdx, args) {
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
     * DialogFormOpen 弹窗(表单)出现后的准备提交表单的事件策略
     *
     * 通常这里写表单提交"Post"等请求接口
     *
     * 策略名 以 "DialogFormOpen"结尾 的 事件 经过 `getDialogFormOpenEventStrategy` 处理后,点击提交按钮时的逻辑
     *
     * 如,新增按钮 弹窗后 填完表单 点击提交按钮时 需要先校验表单,再执行请求;表单校验逻辑不需要,只需要写请求逻辑即可
     */
    getDialogFormValidSubmitEventStrategy(strategyName, pickedRowIdx, args) {
      const strategys = {};
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
.form-above-table {
  margin-top: 50px;
}

/* 表单的不同item项，需要在同一行 */
.form-above-table /deep/ .el-form-item {
  width: 400px;
  display: inline-block;
}

.form-above-table /deep/ .el-form-item .el-form-item__content {
  width: 350px;
}

.form-above-table /deep/ .el-form-item .el-form-item__content > div {
  width: calc(140% - 250px);
}

/* 左右布局比例 */
/* 仅当formAboveTable右边有三个按钮时的布局;右边得加宽不然放不下三个按钮 */
.form-above-table.form-above-table-layout
  /deep/
  .common-form-container
  .form-content-box {
  width: calc(100% - 300px);
}
.form-above-table.form-above-table-layout
  /deep/
  .common-form-container
  .default-btns-box {
  width: 300px;
}
</style>
