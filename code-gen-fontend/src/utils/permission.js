import store from '@/store'
import Vue from 'vue'
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
    if (value && value instanceof Array && value.length > 0) {
        const roles = store.getters && store.getters.roles
        const permissionRoles = value

        const hasPermission = roles.some(role => {
            return permissionRoles.includes(role)
        })

        if (!hasPermission) {
            return false
        }
        return true
    } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
    }
}

export const checkBtnPermission = (that, key) => {
    //const idx = that.$route.meta.buttonList.findIndex(btn => btn.key === key);
    //that.$store.buttons.includes(key)
    let isAuthBtn = true//false;
    /* if (idx !== -1) {
        isAuthBtn = that.$route.meta.buttonList[idx].isAuth || that.$route.meta.buttonList[idx].menuPerms === null;
        //console.log(key, idx, isAuthBtn, that.$route.meta.buttonList)
    } else {
        isAuthBtn = true;
    } */
    return true; //TODO:FIXME: 暂且开通权限
    return that.$store.getters.buttons.includes(key);
}