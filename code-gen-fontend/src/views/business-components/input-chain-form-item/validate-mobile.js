import {
  validPhone
} from '@/utils/validate'
/**
 * validKeyName 表单需要校验的字段的key
 */
export const validateMobile = (rule, value, callback, that, formItemMetaListModalAlias = 'formItemMetaListModal', validateKeyName) => {
  const mobileList = value.split(',')
  const idx = that[formItemMetaListModalAlias].findIndex(item => item.key === validateKeyName)
  let errMsg = ''
  const getNullCondIdx = mobileList.indexOf('')
  const getPhoneErrCondIdx = mobileList.findIndex(el => !validPhone(el))
  const curErrIdx = getNullCondIdx !== -1 ? getNullCondIdx : getPhoneErrCondIdx
  if (getNullCondIdx !== -1) {
    errMsg = '存在未填写的输入框'
    that.$set(that[formItemMetaListModalAlias][idx].componentAttr.triggeredErrTargets, `InputRef${curErrIdx}`, errMsg)
    callback(new Error(errMsg))
    // callback();
  } else if (getPhoneErrCondIdx !== -1) {
    errMsg = '手机号码格式不正确'
    that.$set(that[formItemMetaListModalAlias][idx].componentAttr.triggeredErrTargets, `InputRef${curErrIdx}`, errMsg)
    callback(new Error(errMsg))
    // callback();
  } else {
    const keys = Object.keys(that[formItemMetaListModalAlias][idx].componentAttr.triggeredErrTargets)
    if (keys.length > 0) {
      that.$delete(that[formItemMetaListModalAlias][idx].componentAttr.triggeredErrTargets, keys[0])
    }
    callback()
  }
}

function myValidPhone(val) {
  const reg = /^([1][0,1,2,3,4,5,6,7,8,9])\d{9}$/
  return reg.test(val)
}
export const validateSingleMobile = (rule, value, callback, that, formItemMetaListModalAlias = 'formItemMetaListModal', validateKeyName) => {
  let errMsg = ''
  if (!rule.required && value === '') {
    callback()
    return
  }
  if (value === '') {
    errMsg = '手机号码必须填写'
    callback(new Error(errMsg))
  } else if (!myValidPhone(value)) {
    errMsg = '手机号码格式不正确'
    callback(new Error(errMsg))
    // callback();
  } else {
    callback()
  }
}
