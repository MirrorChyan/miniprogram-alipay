App({
  globalData: {},
  onLaunch(options) {
    // 第一次打开
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    console.info('App onShow');
  },
  onHide() {
    // 小程序隐藏
    console.info('App onHide');
  }
});

