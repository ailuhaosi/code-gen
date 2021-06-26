import {
  constantRoutes
} from '../../router'
import Layout from '@/layout'

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
// TODO: key最好不要改变,会与mapMenuPageToRealPageUrl结合使用;且key默认与menuPage相同;
// menuPage 表示源码文件夹结构,一般不变
export const mapKeyToView = {
  // 房产管理
  /* 'biz/region': {
    menuPage: 'biz/region',
    view: () => import('@/views/biz-management/region-management/index.vue')
  },
  'biz/location': {
    menuPage: 'biz/location',
    view: () => import('@/views/biz-management/location-management/index.vue')
  },
  'biz/building': {
    menuPage: 'biz/building',
    view: () => import('@/views/biz-management/building-management/index.vue')
  },
  'biz/unit': {
    menuPage: 'biz/unit',
    view: () => import('@/views/biz-management/unit-management/index.vue')
  },
  // 住户管理
  'resident/room': {
    menuPage: 'resident/room',
    view: () => import('@/views/resident-management/room-management/index.vue')
  },
  'resident/room-chglist': {
    menuPage: 'resident/room-chglist',
    view: () => import('@/views/resident-management/room-management/room-chglist.vue')
  },
  'resident/roommp': {
    menuPage: 'resident/roommp',
    view: () => import('@/views/resident-management/roommp-management/index.vue')
  },
  'resident/wxbinding': {
    menuPage: 'resident/wxbinding',
    view: () => import('@/views/resident-management/wxbinding-management/index.vue')
  },
  // 门禁管理
  'door/door': {
    menuPage: 'door/door',
    view: () => import('@/views/door-management/door-management/index.vue')
  },
  'door/card': {
    menuPage: 'door/card',
    view: () => import('@/views/door-management/card-management/index.vue')
  },
  'door/carddetail': {
    menuPage: 'door/carddetail',
    view: () => import('@/views/door-management/card-management/card-detail.vue')
  },
  'door/doorcarddetail': {
    menuPage: 'door/doorcarddetail',
    view: () => import('@/views/door-management/door-management/door-carddetail.vue')
  },
  'door/doorvisit': {
    menuPage: 'door/doorvisit',
    view: () => import('@/views/door-management/door-visitor/index.vue')
  },
  'door/doorlog': {
    menuPage: 'door/doorlog',
    view: () => import('@/views/door-management/doorlog/index.vue')
  },
  'door/openlog': {
    menuPage: 'door/openlog',
    view: () => import('@/views/door-management/openlog/index.vue')
  },
  // 系统管理
  'sysmanage/role': {
    menuPage: 'sysmanage/role',
    view: () => import('@/views/sys-management/role-management/index.vue')
  },
  'sysmanage/roledetail': {
    menuPage: 'sysmanage/roledetail',
    view: () => import('@/views/sys-management/role-management/role-detail.vue')
  },
  'sysmanage/user': {
    menuPage: 'sysmanage/user',
    view: () => import('@/views/sys-management/user-management/index.vue')
  },
  'sysmanage/menu': {
    menuPage: 'sysmanage/menu',
    view: () => import('@/views/sys-management/menu-management/index.vue')
  },
  'sysmanage/paramset': {
    menuPage: 'sysmanage/paramset',
    view: () => import('@/views/sys-management/sys-param/index.vue')
  },
  'log/log': {
    menuPage: 'log/log',
    view: () => import('@/views/sys-log/operation-log/index.vue')
  },
  'log/errorlog': {
    menuPage: 'log/errorlog',
    view: () => import('@/views/sys-log/err-log/index.vue')
  },
  'schedule/schedulelog': {
    menuPage: 'schedule/schedulelog',
    view: () => import('@/views/schedule/schedule-log/index.vue')
  },
  'schedule/schedule': {
    menuPage: 'schedule/schedule',
    view: () => import('@/views/schedule/schedule/index.vue')
  } */
  // 'Index.vue':undefined
}
const allMenuPageKeys = Object.keys(mapKeyToView)
const allMenuPages = allMenuPageKeys.map(key => mapKeyToView[key].menuPage)
// 映射key到真实页面链接
const mapKeyToRealPageUrl = {}
export function filterAsyncRoutes(roles, depth = 0, lastModulePath = '') {
  var res = []
  roles.forEach(role => {
    let modulePath
    let modulePathPrefix = ''
    depth == 0 ? modulePathPrefix = '/' : modulePathPrefix = ''
    modulePath = (role.menuUrl ? `${modulePathPrefix}${role.menuUrl}` : `${modulePathPrefix}default${random(1, 100)}`)

    const appendAttrObj = {}
    if (role.menuType === 0) {
      appendAttrObj.alwaysShow = true
    }

    // 获取匹配到的组件的key的索引
    const matchedKeyIdx = allMenuPages.findIndex(key => key === role.menuPage)
    if (matchedKeyIdx !== -1) {
      if (depth <= 1) {
        mapKeyToRealPageUrl[allMenuPageKeys[matchedKeyIdx]] = lastModulePath.endsWith('/') ? lastModulePath + modulePath : lastModulePath + '/' + modulePath
      } else {
        const fullPath = lastModulePath.endsWith('/') ? lastModulePath + modulePath : lastModulePath + '/' + modulePath

        const pathArr = fullPath.split('/')
        mapKeyToRealPageUrl[allMenuPageKeys[matchedKeyIdx]] = `/${pathArr[1]}/${pathArr.slice(-1)}`
      }
      // mapKeyToRealPageUrl[allMenuPageKeys[matchedKeyIdx]] = lastModulePath.endsWith('/') ? lastModulePath + modulePath : lastModulePath + '/' + modulePath;
    }
    // console.log(modulePath, '========')
    const tmp = {
      path: modulePath,
      name: role.menuUrl,
      // iconUrl: role.menuIcon,
      meta: {
        title: role.menuName,
        icon: 'dashboard'
        // menuPerms: role.menuPerms
      },
      component: role.menuType === 0 ? Layout : (matchedKeyIdx !== -1 ? mapKeyToView[allMenuPageKeys[matchedKeyIdx]].view : undefined),
      hidden: role.menuType === 2,
      ...appendAttrObj
    }
    if (role.list && depth < 1) {
      tmp['children'] = filterAsyncRoutes(role.list, depth + 1, lastModulePath + modulePath + '/')
    }
    // 只添加目录、菜单
    if (role.menuType !== 2 || matchedKeyIdx !== -1) {
      res.push(tmp)
    }
    if (role.list && depth == 1) {
      res = res.concat(filterAsyncRoutes(role.list.filter(item => item.menuUrl != null), depth + 1, lastModulePath + modulePath + '/'))
    }
  })
  return res
}

export function filterButtonPermissions(roles) {
  var res = []
  roles.forEach(role => {
    if (role.list && role.menuType != 2) {
      res = res.concat(filterButtonPermissions(role.list))
    } else {
      if (role.menuPerms) {
        var perms = role.menuPerms.split(',')
        res = res.concat(perms)
      }
    }
  })
  return res
}

const otherRole = {
  path: '*',
  redirect: '/404',
  hidden: true
}

const state = {
  routes: [],
  addRoutes: [],
  buttons: [],
  mapKeyToRealPageUrl: mapKeyToRealPageUrl,
  navTreeData: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_REALPAGEURL: (state, mapKeyToRealPageUrl) => {
    state.mapKeyToRealPageUrl = mapKeyToRealPageUrl
  },
  SET_NAVTREEDATA: (state, navTreeData) => {
    state.navTreeData = navTreeData
  }
}

const actions = {
  generateRoutes({
    commit
  }, res) {
    return new Promise(resolve => {
      const accessedRoutes = [];//filterAsyncRoutes(res.menuList)//TODO:FIXME:
      accessedRoutes.push(otherRole) // 其他路由过滤
      //let buttonPermissions = filterButtonPermissions(roles)
      //buttonPermissions = buttonPermissions.filter((item, index) => buttonPermissions.indexOf(item) === index)
      // console.log('临时看看按钮===', buttonPermissions,accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_BUTTONS', res.permissions.join(','))
      commit('SET_REALPAGEURL', mapKeyToRealPageUrl)
      commit('SET_NAVTREEDATA', res.menuList)
      resolve(accessedRoutes)
    })
  },
  resetPermissions({
    commit
  }) {
    commit('SET_ROUTES', [])
    commit('SET_BUTTONS', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
