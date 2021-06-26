<template>
  <div
    id="app"
    class="contentinner bs"
  >
    <router-view />
  </div>
</template>

<script>
import { FixAppRouterJumpBug } from '@/mixins/FixAppRouterJumpBug.js'
export default {
  name: 'App',
  mixins: [FixAppRouterJumpBug]
}
</script>
<style lang="scss">
/* 解决element-ui的table表格控件表头与内容列不对齐问题 */
.el-table th.gutter {
  display: table-cell !important;
}
/* 解决el-dialog 居中 且 头尾始终可见 */
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  border: 1px solid #066cae;

}
.el-form.form-content{
  text-align:left;
}
.el-dialog .el-dialog__body {
  /* flex: 1; */
  flex:1 1 auto;
  overflow: auto;
}
</style>
<style>
.mainbox .el-form-item .el-select,
.mainbox .el-form-item .el-cascader {
  width: 100%;
  padding: 0;
}
.mainbox.detailbox {
  width: 100%;
  padding: 0 10px 80px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
.contentinner .mainbox.detailbox .title {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #eee;
  position: relative;
  line-height: 42px;
  font-weight: bold;
  font-size: 14px;
  float: left;
}
.contentinner .mainbox.detailbox ul {
  width: 100%;
  overflow: hidden;
  padding: 10px 0 30px;
  float: left;
}
.contentinner .mainbox.detailbox ul li {
  float: left;
  width: 28%;
  overflow: hidden;
  margin-right: 5%;
}
.contentinner .mainbox.detailbox ul li h4 {
  width: 100%;
  font-size: 12px;
  color: #7d89a0;
  padding: 15px 0;
  font-weight: normal;
}
.contentinner .mainbox.detailbox ul li p {
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background: #fff;
  color: #17243d;
  font-size: 12px;
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
}
.contentinner .mainbox.detailbox ul li.longli {
  width: 57%;
}
.contentinner .mainbox.detailbox ul.mxbox {
  width: 100%;
  overflow: hidden;
}
.contentinner .mainbox.detailbox ul.mxbox li {
  width: 45%;
  margin-right: 5%;
  font-size: 12px;
  color: #333;
}
.contentinner .mainbox.detailbox ul.mxbox li span {
  width: 50%;
  text-align: left;
  float: left;
  line-height: 36px;
}
.contentinner .mainbox.detailbox .btnbox {
  width: calc(100% - 220px);
  overflow: hidden;
  text-align: center;
  padding: 15px 0;
  position: fixed;
  bottom: 10px;
  left: 205px;
  background: #fff;
  border-top: 1px solid #eee;
}
.contentinner .mainbox.detailbox .btnbox a {
  display: inline-block;
  padding: 10px 20px;
  text-align: center;
  min-width: 35px;
  text-align: center;
  font-size: 13px;
  border-radius: 4px;
}
.contentinner .detailbox .btnbox a.backbtn {
  background: #266fff;
  color: #fff;
  border: 1px solid #266fff;
  margin: 0 10px;
}
.contentinner .detailbox .btnbox a.backbtn:hover {
  background: #fff;
  color: #266fff;
}
</style>
