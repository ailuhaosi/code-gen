import request from '@/utils/request'

export function getRoleSelect(params) {
    return request({
        url: '/sys/role/select',
        method: 'get',
        params
    })
}

export function getRoleList(params) {
    return request({
        url: '/sys/role/list',
        method: 'get',
        params
    })
}

export function getRoleInfoById(roleId) {
    return request({
        url: `/sys/role/info/${roleId}`,
        method: 'get'
    })
}

export function saveRole(data) {
    return request({
        url: '/sys/role/save',
        method: 'post',
        data
    })
}

export function updateRoleBaseInfo(data) {
    return request({
        url: '/sys/role/updateRoleBase',
        method: 'post',
        data
    })
}

export function deleteRoleById(roleId) {
    return request({
        url: `/sys/role/delete/${roleId}`,
        method: 'post'
    })
}

export function updateRoleMenu(data) {
    return request({
        url: '/sys/role/updateRoleMenu',
        method: 'post',
        data
    })
}

export function updateRoleRegion(data) {
    return request({
        url: '/sys/role/updateRoleRegion',
        method: 'post',
        data
    })
}