export const LazyRequestDevStatus = {
  data() {
    return {
      progressTipVisible: false,
      progressTipText: '',
      // canBreakLazyLoop: false, // 轮询退出标志
      // canEndLoopRequest: false, // 循环请求是否结束标志
      lazyLoopTimeOutArr: [] // 存储轮询每次的定时器
    }
  },
  watch: {
    /* 关闭对话框后,自动清除所有的定时器 */
    progressTipVisible(newVal, oldVal) {
      if (!newVal) {
        while (this.lazyLoopTimeOutArr.length > 0) {
          clearTimeout(this.lazyLoopTimeOutArr.shift())
        }
      }
    }
  },
  methods: {
    async lazyRequest(doRequest, params, isMock = false) {
      let ret = {
        code: 0,
        data: ''
      }
      if (!isMock) {
        // 手动关闭表单框
        this.$refs['FormModalRef'].doOperation('FormCancelThenClearDialogVisible', null)
        // 手动开启提示框
        this.progressTipVisible = true
        this.progressTipText = '操作中，请等待......'
        // //////////////////////////////////////////
        // console.log('开始循环==', params)
        let canBreakLazyLoop = false // 重置轮询退出标志
        let canEndLoopRequest = false // 重置循环请求结束标志
        let index = 0
        while (!canBreakLazyLoop) {
          ((i) => {
            const t = setTimeout(async() => {
              this.lazyLoopTimeOutArr.shift()
              if (!canEndLoopRequest) {
                ret = await doRequest(params.data)
                // console.log(ret)
                this.progressTipText = ret.data
                if (ret.code !== 1) {
                  canEndLoopRequest = true
                  this.getTableList()
                }
              }
            }, (i + 1) * 1000)
            this.lazyLoopTimeOutArr.push(t)
          })(index)
          index += 1
          // 超过500s 自动退出轮询
          if (index > 500) {
            canBreakLazyLoop = true
          }
        }
      } else {
        const mockDataList = [{
          code: 1,
          data: '操作中请等待1'
        }, {
          code: 1,
          data: '操作中请等待2'
        }, {
          code: 1,
          data: '操作中请等待3'
        }, {
          code: 1,
          data: '操作中请等待4'
        }, {
          code: 1,
          data: '操作中请等待5'
        }, {
          code: 0,
          data: '操作成功'
        }]
        for (let index = 0; index < mockDataList.length; index++) {
          ((i) => {
            setTimeout(() => {
              const curMockData = mockDataList[index]
              ret = curMockData
              this.progressTipText = ret.data
            }, (i + 1) * 1000)
          })(index)
        }
      }
      return Promise.resolve(ret)
    }
  }
}
