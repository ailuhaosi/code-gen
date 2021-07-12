package io.gd.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import lombok.Data;

import java.util.Map;

@Data
public class ComponentConfigDTO {
    private String columnName;
    //属性名称(第一个字母大写)，如：user_name => UserName
    private String attrName;
    public String getAttrName() {
        return attrName;
    }

    public void setAttrName(String attrName) {
        this.attrName = attrName;
    }
    //属性名称(第一个字母小写)，如：user_name => userName
    private String attrname;

    public String getAttrname() {
        return attrname;
    }

    public void setAttrname(String attrname) {
        this.attrname = attrname;
    }

    private String dataType;
    //列名备注
    private String comments;

    //属性类型
    private String attrType;
    private Boolean isPrimary;
    private String componentKey;
    private String componentLabel;
    private String componentType;
    private ComponentAttrDTO componentAttr;
}
