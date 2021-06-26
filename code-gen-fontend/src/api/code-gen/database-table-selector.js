import request from '@/utils/request'

export function getDatabaseTableList(params = {}) {
    return request({
      url: '/sys/generator/list',
      method: 'get',
      params
    })
  }
  

  export function getDatabaseTableColumnInfoList(params = {}) {
    return request({
      url: '/sys/generator/info',
      method: 'get',
      params
    })
  }

  export function downloadSourceCode(data) {
    return request({
      url: '/sys/generator/download-sourcecode',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }