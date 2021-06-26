
//每种组件类型一个弹窗
// mixins_···AttrDialogFormItemMetaList
export const ComponentsAttrsDialogFormMixins = {
  data () {
    return {
      mixins_InputAttrDialogFormItemMetaList: [
        {
          label: "placeholder：",
          type: "Input",
          key: "placeholder",
          componentAttr: { placeholder: "请输入placeholder" }
        }],
        mixins_SelectAttrDialogFormItemMetaList: [
          {
            label: "placeholder：",
            type: "Input",
            key: "placeholder",
            componentAttr: { placeholder: "请输入placeholder" }
          },{
            label: "options：",
            type: 'CustomizeFormItem',
            key: "_options",
            rootPathType: 'views',
            componentFilePath: 'business-components/key-val-mapping-form-item/index.vue',
            componentAttr: { }
          }],
          mixins_MatchMapValAttrDialogFormItemMetaList: [{
              label: "matchMapObj：",
              type: 'CustomizeFormItem',
              key: "_matchMapObj",
              rootPathType: 'views',
              componentFilePath: 'business-components/key-val-mapping-form-item/index.vue',
              componentAttr: { }
            }],
    }
  }
}