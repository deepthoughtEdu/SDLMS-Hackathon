/**
 * @template T
 * @typedef {{
 *  (value: T, field: string, parent: Object) => boolean, 
 *  error: string, 
 *  type: string, 
 *  isArray?: boolean
 * }} TypeFunc
 */

/**
 * 
 * @param {Object} obj - any object to create a deep copy of
 * @returns {Object} - a deep copy of obj
 */
function deepCopy(obj, stack = 0) {
    if(stack > 100) return Array.isArray(obj) ? [...obj] : {...obj}
    if(typeof obj !== "object" || obj == null) return obj
    if(Array.isArray(obj)) return obj.map(val => deepCopy(val, stack + 1))
    return Object.keys(obj).reduce((copiedObj, key) => ({
        ...copiedObj,
        [key]: deepCopy(obj[key], stack + 1)
    }), {})
}
function isObject(object) {
    return object != null && (typeof object === "function" || typeof object === "object")
}

/**
 * 
 * @param {string} type - name of the type
 * @param {(value: any, key: string, parent: object, req: object) => boolean} typeValidator - function to validate the given type
 * @param {string} error 
 * @param {boolean} isArray 
 * @returns {TypeFunc<T>}
 */
function createType(type, typeValidator, error, isArray=false) {
    if(!type) throw new Error("type is required")
    if(!typeValidator instanceof Function) throw new Error("typeValidator must be a function")
    if(!error) throw new Error("error is required")
    typeValidator.error = error
    typeValidator.isArray = isArray
    return typeValidator
}

module.exports = {deepCopy, isObject, createType}