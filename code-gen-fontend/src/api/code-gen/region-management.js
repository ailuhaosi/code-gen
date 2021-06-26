import request from '@/utils/request'

export function getRegionSelect(params = {}) {
  return request({
    url: '/biz/region/select',
    method: 'get',
    params
  })
}

export function getRegionInfo(params) {
  return request({
    url: `/biz/region/info`,
    method: 'get',
    params
  })
}

export function getRegionList(params) {
  return request({
    url: '/biz/region/list',
    method: 'get',
    params
  })
}

export function saveRegion(data) {
  return request({
    url: '/biz/region/save',
    method: 'post',
    data
  })
}

export function updateRegion(data) {
  return request({
    url: '/biz/region/update',
    method: 'put',
    data
  })
}

export function deleteRegionByIds(data) {
  return request({
    url: `/biz/region/delete`,
    method: 'delete',
    data
  })
}
