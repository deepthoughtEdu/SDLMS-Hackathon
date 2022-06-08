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

const {DTID, ArrayOf, Time} = require("./types")
const Fields = require("./Fields")
const init = require("./validations")
init()
/**
 * 
 * @param {Fields} schema 
 * @returns 
 */
function typedFieldValidation(schema) {
    if(!schema instanceof Fields) throw new Error("must provide a Fields object")

    return async (req, res, next) => {
        const {valid, error, result} = await schema.setCurrentRequest(req).validate(Object.keys(req.body).length === 0 ? req.query : req.body)
        // req.isValid = valid
        // req.validityError = error
        if(!valid) {
            res.status(400).send({response: {}, status: {code: "bad-request", message: error}})
            return
        }
        if(Object.keys(req.body).length === 0) {
            req.query = result
            next()
            return
        }
        req.body = result
        next()
    }
}

module.exports = {typedFieldValidation, Fields, DTID, ArrayOf, Time}