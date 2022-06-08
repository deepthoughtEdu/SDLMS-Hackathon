/**
 * @template T
 * @typedef {{
 *  eq?: T,
 *  equal?: T,
 *  enum?: T,
 *  required?: boolean,
 *  requires?: string[],
 *  requiresFieldsToBeEqual?: {[string]: any}
 * }} BasicOptions
 * @typedef {BasicOptions<T> & {
 *  lt?: T,
 *  lte?: T,
 *  gt?: T,
 *  gte?: T,
 *  range?: T
 * }} OptionsWithNoType
 * @typedef {{
 *  (value: T, field: string, parent: Object) => boolean, 
 *  error: string, 
 *  type: string, 
 *  isArray?: boolean
 * }} TypeFunc
 * @typedef {{
 *  type?: string,
 *  required?: boolean,
 *  requires?: string[],
 *  requiresFieldsToBeEqual?: {[string]: any}
 * }} OptionsForArray
 * @typedef {OptionsWithNoType<T> & {
 *  type?: (string|TypeFunc)
 * }} Options
 */

/**
 * 
 * @param {Object} obj - any object to create a deep copy of
 * @returns {Object} - a deep copy of obj
 */

const {createType} = require("./utils")
function DTID(id, key, parent) {
    const lid = parseInt(id)
    if(!lid || lid < 1) return false
    parent[key] = lid
    return true
}
DTID.type = "id"
DTID.error = "Invalid $field${index| at index }${name| in }"

/**
 * 
 * @param {string} type - type of the array type
 * @returns {TypeFunc<T>}  
 */
function ArrayOf(type) {
    /**
     * @author Subham Bhattacharjee
     * @description type for arrays
     * @param {any[]} array - array to type check
     * @param {string} key - key of the field
     * @param {Object} parent - parent of the array
     * @returns {boolean}
     */
    if(!type instanceof String && !type instanceof Function) throw new Error("type must either be a function or a string")
    const ArrayType = type === "any" ? (array, key, parent) => Array.isArray(array) : (array, key, parent) => {
        ArrayType.error = `$field must be an ${ArrayType.type}\${index| at index }\${name| in }!`
        if(!Array.isArray(array)) return false
        if(type instanceof Function) return array.every((current, key, index) => {
            const mockParent = {[key]: array[index]}
            const result = type(current, key, mockParent)
            parent[key][index] = mockParent[key]
            ArrayType.error = `$field must be a ${type.type} at index ${index}`
            return result
        })
        return array.every((current, index) => {
            result = typeof current === type
            ArrayType.error = `$field must be a ${type} at index ${index}`
            return result
        })
    }
    ArrayType.type = `Array of ${type?.type ?? type ?? "any"}`
    ArrayType.isArray = true
    ArrayType.error = `$field must be an ${ArrayType.type}\${index| at index }\${name| in }!`
    return ArrayType
}
function Time(time, key, parent) {
    if(!Date(time)) return false
    parent[key] = Date(time)
}
Time.error = `$field must be a valid time \${index| at index }\${name| in }!`
Time.type = "valid time"

module.exports = {DTID, ArrayOf, Time}