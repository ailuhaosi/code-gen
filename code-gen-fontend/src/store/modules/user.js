import {
  Message
} from 'element-ui'
import {
  login,
  logout,
  getInfo
} from '@/api/sys'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import {
  arrayFlatAndRemoveRepeat
} from '@/utils'
const state = {
  token: getToken(),
  user_info: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {},
  // ///
  avatar: '',
  introduction: '',
  roles: [],
  permissionIdList: sessionStorage.getItem('permissionIdList') ? JSON.parse(sessionStorage.getItem('permissionIdList')) : [],
  permissionObjList: sessionStorage.getItem('permissionObjList') ? JSON.parse(sessionStorage.getItem('permissionObjList')) : []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
  },
  SET_USER_INFO: (state, user_info) => {
    sessionStorage.setItem('userInfo', JSON.stringify(user_info))
    state.user_info = user_info
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONIDLIST: (state, permissionIdList) => {
    if (permissionIdList.length > 0) {
      sessionStorage.setItem('permissionIdList', JSON.stringify(permissionIdList))
      state.permissionIdList = permissionIdList
    } else {
      sessionStorage.removeItem('permissionIdList')
      state.permissionIdList = []
    }
  },
  SET_PERMISSIONOBJLIST: (state, permissionObjList) => {
    if (permissionObjList.length > 0) {
      sessionStorage.setItem('permissionObjList', JSON.stringify(permissionObjList))
      state.permissionObjList = permissionObjList
    } else {
      sessionStorage.removeItem('permissionObjList')
      state.permissionObjList = []
    }
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        console.log(res,"=======")
        commit('SET_TOKEN', res.token)
        resolve(res)
      }).catch(error => {
        console.log(error, '5555')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {
          roles,
          name,
          avatar,
          introduction
        } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONIDLIST', [])
        commit('SET_PERMISSIONOBJLIST', [])
        sessionStorage.clear()
        // localStorage.clear()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {
          root: true
        })

        resolve()
      }).catch(error => {
        console.log(error.message)
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
