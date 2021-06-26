import request from '@/utils/request'

export function getParamList(params) {
  return request({
    url: '/sys/param/list',
    method: 'get',
    params
  })
}

export function getParamInfoById(paramId) {
  return request({
    url: `/sys/param/info/${paramId}`,
    method: 'get'
  })
}

export function saveParam(data) {
  return request({
    url: '/sys/param/save',
    method: 'post',
    data
  })
}

export function updateParam(data) {
  return request({
    url: '/sys/param/update',
    method: 'post',
    data
  })
}

export function closeParamById(paramId) {
  return request({
    url: `/sys/param/close/${paramId}`,
    method: 'post'
  })
}
