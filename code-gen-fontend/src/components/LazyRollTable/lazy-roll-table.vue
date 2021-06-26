<template>
  <el-table
    ref="lazyRollTableRef"
    v-loading="tableListLoading"
    class="product-base-info-product-table"
    :height="computedTableHeight"
    :data="tableBodyData"
    border
    fit
    highlight-current-row
    style="width: 100%"
    @selection-change="doPickedItems"
  >
    <el-table-column
      v-if="hasSelection"
      type="selection"
      width="55"
    />
    <el-table-column
      v-if="hasSerial"
      align="center"
      label="序号"
      :width="'80%'"
    >
      <template slot-scope="scope">
        <span>{{ scope.$index+1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item,idx) in tableHeaderData"
      :key="item.label"
      align="center"
      :label="item.label"
      :width="item.width"
      :min-width="item.minWidth"
    >
      <template slot-scope="{row}">
        <span v-if="isIcon===false">{{ typeof row[idx+1+'']==='boolean'?row[idx+1+'']?'是':'否':row[idx+1+''] }}</span>
        <div v-else />
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
let lastScrollTop = 0
export default {
  name: 'LazyRollTable',
  props: {
    adjustedHeight: {
      default: 0,
      type: Number,
      required: false
    },
    // 是否表格内容为图标
    isIcon: {
      default: false,
      type: Boolean,
      required: false
    },
    // FIXME:必须有选择框,否则下面的 doPickedItems 方法的逻辑需要改
    hasSelection: {
      default: true,
      type: Boolean,
      required: false
    },
    hasSerial: {
      default: false,
      type: Boolean,
      required: true
    },
    tableHeaderData: {
      default: () => [],
      type: Array,
      required: true
    },
    tableBodyData: {
      default: () => [],
      type: Array,
      required: true
    },
    tableListLoading: {
      default: false,
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      computedTableHeight: 452
    }
  },
  computed: {
  },
  mounted() {
    // this.doComputedTableHeight()
    this.setListenerTableScroll()
  },
  methods: {
    doPickedItems(selection) {
      this.$emit('doPickedLazyRollTableItems', selection)
      this.pickedProducts = selection
    },
    // 监听到滚动事件时，执行的回调方法
    listenTableScroll(res) {
      const height = res.target
      const clientHeight = height.clientHeight
      const scrollTop = height.scrollTop
      const scrollHeight = height.scrollHeight// 滚动总高度范围
      const nowScrolHeight = clientHeight + scrollTop// 当前滚动高度
      const everyHeight = Math.ceil(scrollHeight / this.tableBodyData.length)// 每个条目的高度
      const nowItem = Math.ceil(nowScrolHeight / everyHeight)
      console.log('当前滚动位置的item===', nowItem)
      console.log('滚动条的高度===', scrollTop, scrollHeight - clientHeight)
      // 垂直滚动才触发
      if (lastScrollTop < scrollTop) {
        this.$emit('checkScrollReq', nowItem)
      }
      lastScrollTop = scrollTop
    },
    // 设置滚动监听
    setListenerTableScroll() {
      this.$refs['lazyRollTableRef'].bodyWrapper.addEventListener('scroll', this.listenTableScroll, true)
      this.$once('hook:beforeDestroy', function() {
        this.$refs['lazyRollTableRef'].bodyWrapper.removeEventListener('scroll', this.listenTableScroll, true)
      })
    },
    doComputedTableHeight() {
      this.$nextTick(() => {
        this.computedTableHeight = document.body.clientHeight - this.$refs['lazyRollTableRef'].$el.getBoundingClientRect().top + 0 // this.adjustedHeight
        console.log('计算高度====', this.$refs['lazyRollTableRef'].$el.offsetTop, document.body.clientHeight, this.getElementTop(this.$refs['lazyRollTableRef'].$el), this.$refs['lazyRollTableRef'].$el.getBoundingClientRect().top)
      })
    }
  }
}
</script>

<style>
</style>
