module.exports = {
  BASE_URL: process.env.NODE_ENV === 'production' ? 'http://localhost' : 'http://localhost',
  BASE_API: process.env.NODE_ENV === 'production' ? 'http://localhost/api' : '/api',
  // VIDEO_MONITOR_BASE_URL: 'http://192.168.20.120:5001/1.119.197.163:65092/run_',
  IS_MOCK: false
}

// 正式服 https://jbzhxq.inteink.com
// 测试服 https://xqtest.inteink.com
