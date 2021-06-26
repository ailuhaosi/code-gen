import request from '@/utils/request'

export function getUserList(params) {
    return request({
        url: '/sys/user/list',
        method: 'get',
        params
    })
}

export function getUserInfoById(userId) {
    return request({
        url: `/sys/user/info/${userId}`,
        method: 'get'
    })
}

export function saveUser(data) {
    return request({
        url: '/sys/user/save',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/sys/user/update',
        method: 'post',
        data
    })
}

export function resetUserPassword(data) {
    return request({
        url: '/sys/user/reset',
        method: 'post',
        data
    })
}

export function deleteUserById(userId) {
    return request({
        url: `/sys/user/delete/${userId}`,
        method: 'post'
    })
}

export function closeUserById(userId) {
    return request({
        url: `/sys/user/close/${userId}`,
        method: 'post'
    })
}

export function openUserById(userId) {
    return request({
        url: `/sys/user/open/${userId}`,
        method: 'post'
    })
}