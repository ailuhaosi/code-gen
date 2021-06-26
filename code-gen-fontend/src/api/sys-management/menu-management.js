import request from '@/utils/request'

export function getMenuSelect(params) {
    return request({
        url: '/sys/menu/select',
        method: 'get',
        params
    })
}

export function getMenuList(params) {
    return request({
        url: '/sys/menu/list',
        method: 'get',
        params
    })
}

export function saveMenu(data) {
    return request({
        url: '/sys/menu/save',
        method: 'post',
        data
    })
}

export function updateMenu(data) {
    return request({
        url: '/sys/menu/update',
        method: 'post',
        data
    })
}

export function deleteMenuById(roleId) {
    return request({
        url: `/sys/menu/delete/${roleId}`,
        method: 'post'
    })
}


export function getMenuNavList() {
    return request({
        url: '/sys/menu/nav',
        method: 'get'
    })
}