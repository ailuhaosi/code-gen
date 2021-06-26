
import Vue from 'vue';
/**
 * src/shared/util.js
 */
const _toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
}

function isUndef(v) {
    return v === undefined || v === null
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
* Check if val is a valid array index.
*/
function isValidArrayIndex(val) {
    const n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}
/**
 *  src/core/observer/index.js
 * */

const defineReactive = Vue.util.defineReactive;
const warn = Vue.util.warn;
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target, key, val) {
    if (process.env.NODE_ENV !== 'production' &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target)}`)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
            'Avoid adding reactive properties to a Vue instance or its root $data ' +
            'at runtime - declare it upfront in the data option.'
        )
        return val
    }
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}

/**
 * src/core/util/options.js
 */
/* istanbul ignore next */
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
const hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
    if (!from) return to
    let key, toVal, fromVal

    const keys = hasSymbol
        ? Reflect.ownKeys(from)
        : Object.keys(from)

    for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        // in case the object is already observed...
        if (key === '__ob__') continue
        toVal = to[key]
        fromVal = from[key]
        if (!hasOwn(to, key)) {
            set(to, key, fromVal)
        } else if (
            toVal !== fromVal &&
            isPlainObject(toVal) &&
            isPlainObject(fromVal)
        ) {
            mergeData(toVal, fromVal)

        }
    }
    return to
}

/**
 * Data
 */
export function mergeDataOrFn(
    parentVal,
    childVal,
    vm
) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal
        }
        if (!parentVal) {
            return childVal
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(
                typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
            )
        }
    } else {
        return function mergedInstanceDataFn() {
            // instance merge
            const instanceData = typeof childVal === 'function'
                ? childVal.call(vm, vm)
                : childVal
            const defaultData = typeof parentVal === 'function'
                ? parentVal.call(vm, vm)
                : parentVal
            if (instanceData) {
                return mergeData(instanceData, defaultData)
            } else {
                return defaultData
            }
        }
    }
}

export const myDataMergeStrategy = (parentVal, childVal, vm) => {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            process.env.NODE_ENV !== 'production' && warn(
                'The "data" option should be a function ' +
                'that returns a per-instance value in component ' +
                'definitions.',
                vm
            )

            return parentVal
        }
        return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
}
