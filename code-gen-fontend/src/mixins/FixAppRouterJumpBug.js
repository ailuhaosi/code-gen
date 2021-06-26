export const FixAppRouterJumpBug = {
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.backAction, false)
      window.addEventListener('beforeunload', this.refreshAction)
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backAction, false)
    window.removeEventListener('beforeunload', this.refreshAction)
  },
  methods: {
    backAction() {
      sessionStorage.setItem('BACK_ACTION', '1')
      // console.log('回退按钮====')
    },
    refreshAction() {
      sessionStorage.setItem('REFRESH_ACTION', '1')
      // console.log('刷新按钮====');
    }
  }
}
