import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken,
  removeToken
} from '@/utils/auth'
import router from '@/router/index.js'
import global from '@/global'
// create an axios instance
const service = axios.create({
  baseURL: global['BASE_API'], // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log(res, '*****')
    // console.log(response, 'kkkkkkkkkk==========', res.code === 500);
    const passUrls = ['/api/sys/generator/download-sourcecode'] // , '/api/biz/card/save', '/api/biz/card/regcardAll', '/api/biz/card/delcardAll'
    const canPass = passUrls.some(el => response.request.responseURL.indexOf(el))
    // console.log(response.request.responseURL, '=============', canPass,'111122222255555512345675555'.indexOf('1234567'));
    if (canPass) {
      return res
    } else if (res.code !== 0) {
      // 不管后台返回什么登出时,始终允许
      if (response.request.responseURL.indexOf('/api/sys/logout') !== -1) {
        return true
      } else {
        if (res.code === 403) {
          removeToken()
          router.push('/login')
          Message({
            message: res.msg,
            type: 'warning',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    const {
      status
      // msg
    } = error.response
    console.log('----err-----')
    // console.log(error) // for debug
    // console.log(status===404,'kkkkk')
    console.log('----err-----')
    if (status === 403 || status === '403') {
      removeToken()
      router.push('/login')
      Message({
        message: 'token过期',
        type: 'warning',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '服务器异常',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
