import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

// 首页相关api

export function getUserInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get',
  })
}
// /api/sys/user/password

export function updateUserPassword(data) {
    return request({
        url: '/sys/user/password',
        method: 'post',
        data
    })
}
