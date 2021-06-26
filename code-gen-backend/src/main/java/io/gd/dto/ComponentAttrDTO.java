package io.gd.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BooleanSupplier;

@Data
public class ComponentAttrDTO {
    private String placeholder;
    private Boolean multiple;// 多选下拉组件专用
    private Boolean collapseTags;// 多选下拉组件专用
    private String type;// 输入框组件专用,text textarea password
    private Boolean showPassword;// 输入框组件专用,是否显示密码
    private String startPlaceholder;// 时间日期组件专用
    private String endPlaceholder;// 时间日期组件专用
    private String rangeSeparator;// 时间日期组件专用
    private String format;// 时间日期组件专用
    private String valueFormat;// 时间日期组件专用
    private String defaultTime;// 时间日期组件专用
    // 以下以 _ 开头命名的字段是与componentAttr同层级
    private ComponentAttrMatchMapObjDTO _matchMapObj;// { value: { 1: '设计部', 2: '营销部', 3: '技术部' }, default: "其它" }
    private List<ComponentAttrOptionDTO> _options;

    //遍历所有属性
    public Map<String, Object> getAllAttrs() {
        Map<String, Object> attrStore = new HashMap<String, Object>();
        attrStore.put("placeholder", placeholder);
        attrStore.put("multiple", multiple);
        attrStore.put("collapseTags", collapseTags);
        attrStore.put("type", type);
        attrStore.put("showPassword", showPassword);
        attrStore.put("startPlaceholder", startPlaceholder);
        attrStore.put("endPlaceholder", endPlaceholder);
        attrStore.put("rangeSeparator", rangeSeparator);
        attrStore.put("format", format);
        attrStore.put("valueFormat", valueFormat);
        attrStore.put("defaultTime", defaultTime);

        attrStore.put("_matchMapObj", _matchMapObj);
        attrStore.put("_options", _options);

        return attrStore;
    }

    public String getVariableType(String variableKey) {
        String[] strTypeKeyArr = {"placeholder", "type", "startPlaceholder", "endPlaceholder", "rangeSeparator", "format", "valueFormat", "defaultTime"};
        String retType = "String";
        for (String s : strTypeKeyArr) {
            if (s.equals(variableKey))
                retType = "String";
        }
        String[] booleanTypeKeyArr = {"multiple", "collapseTags", "showPassword"};
        for (String s : booleanTypeKeyArr) {
            if (s.equals(variableKey))
                retType = "Boolean";
        }
        if (variableKey.charAt(0) == '_') {
            retType = variableKey.replace("_","");
        }
        return retType;
    }
}
