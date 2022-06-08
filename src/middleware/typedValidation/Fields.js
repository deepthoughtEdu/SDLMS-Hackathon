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
const {deepCopy} = require("./utils")
const {DTID, ArrayOf, Time} = require("./types")

class Fields {
    /**
     * @author Subham Bhattacharjee
     * @description constructor for fields
     * @param {string} [name] - name of the field
     * @param {boolean} [required] - true if required otherwise false
     * @param {("object"|"array")} [type] - type of the Field which can only be array or object
     * @param {Fields} [copyOf] - to make copy of a another field
     */
    constructor(name, required = false, type="object", copyOf={}) {
        if(!["object", "array"].includes(type)) throw new Error("Fields object must either be array or object")
        this.name = name
        this.type = type
        this.$required = required
        /**
         * @type {{[string]: {[string]: any}}}
         */
        this.$schema = deepCopy(copyOf.$schema ?? {})
        this.currentRequest = {}
    }

    /**
     * 
     * @param {object} req 
     * @returns {this}
     */
    setCurrentRequest(req) {
        this.currentRequest = req
        return this
    }
    /**
     * 
     * @param {string} name - name of this field
     * @returns {this}
     */
    setName(name) {
        this.name = name
        return this
    }

    asArray() {
        this.type = "array"
        return this
    }

    /**
     * 
     * @returns {this}
     */    
    required() {
        this.$required = true
        return this
    }

    /**
     * 
     * @param {string} field - name of the field to set as requird
     * @returns {this}
     * 
     */
    setRequired(field) {
        this.$schema[field].required = true
        return this
    }

    /**
     * 
     * @param {string} field - field to add the options to
     * @param {Options<T>} options - options to add to the given field
     * @returns {this}
     */
    addOptions(field, options = {}) {
        this.add(field, {...this.$schema[field], ...options})
        return this
    }
    
    /**
     * 
     * @param {Fields} parent - parent of this fields
     * @returns {this}
     */
    setParent(parent) {
        this.parent = parent
        return this
    }

    formatErrorMessage(field, message, value, index) {
        return message
            .replace(/\$field|\$\{field(\|([^\|\}]*)){0,1}(\|([^\|\}]*)){0,1}\}/g, `$2${field}$4`)
            .replace(/\$name|\$\{name(\|([^\|\}]*)){0,1}(\|([^\|\}]*)){0,1}\}/g, this.name != null ? `$2${this.name}$4` : "")
            .replace(/\$value|\$\{value(\|([^\|\}]*)){0,1}(\|([^\|\}]*)){0,1}\}/g, value != null ? `$2${value}$4` : "")
            .replace(/\$index|\$\{index(\|([^\|\}]*)){0,1}(\|([^\|\}]*)){0,1}\}/g, index != null ? `$2${index}$4` : "")
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add a field
     * @param {string} field - name of the field
     * @param {Options<T>} [options] - options to ad to the field
     * @returns {this} 
     */
    add(field, options = {}) {
        if(options instanceof Fields) {
            this.$schema[field] = options.setName(field).setParent(this)
            return this
        }

        const Options = ["required", ...Object.keys(Fields.validationFunctions ?? {})].reduce(
            (Options, key) => options[key] ? {...Options, [key]: options[key]} : Options,
            {}
        )

        this.$schema[field] = {
            ...Options,
        }

        return this
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many fields
     * @param {{[string]: Options<T>}} optionsForFields 
     * @returns {this}
     */
    addmany(optionsForFields = {}) {
        Object.keys(optionsForFields).forEach(field => this.add(field, optionsForFields[field]))
        return this
    }
    /**
     * @author Subham Bhattacharjee
     * @description function to add a number type field
     * @param {string} field - name of the field
     * @param {OptionsWithNoType<number>} [options] - options to add to this field
     * @returns {this} 
     */
    number(field, options = {}) {
        return this.add(field, {...options, type: "number"})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many number fields
     * @param {{[string]: OptionsWithNoType<number>}} options 
     * @returns {this}
     */
    numbers(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: "number"}})
        )
        return this.addMany(Options)
    }
    
    /**
     * @author Subham Bhattacharjee
     * @description function to add a string type field
     * @param {string} field - name of the field
     * @param {BasicOptions<string>} [options] - options to add to the given fields
     * @returns {this} 
     */
    string(field, options = {}) {
        return this.add(field, {...options, type: "string"})
    }
    /**
     * @author Subham Bhattacharjee
     * @description function to add many string fields
     * @param {{[string]: BasicOptions<string>}} options
     * @returns {this}
     */
    strings(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: "strings"}})
        )
        return this.addMany(Options)
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add a field of type boolean
     * @param {string} field - name of the field
     * @param {BasicOptions<boolean>} [options] - options to add to the given field
     * @returns {this} 
     */
    bool(field, options = {}) {
        return this.add(field, {...options, type: "boolean"})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many boolean fields
     * @param {{[string]: BasicOptions<boolean>}} options
     * @returns {this}
     */
    bools(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: "boolean"}})
        )
        return this.addMany(Options)
    }
    /**
     * @author Subham Bhattacharjee
     * @description function to add a id field
     * @param {string} field - name of the field
     * @param {Options<(number|string)>} [options] - options to add to the given fields
     * @returns {this} 
     */
    id(field, options = {}) {
        return this.add(field, {...options, type: DTID})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many id fields
     * @param {{[string]: Options<(number|string)>}} options
     * @returns {this}
     */
    ids(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: DTID}})
        )
        return this.addMany(Options)
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add a id field
     * @param {string} field - name of the field
     * @param {Options<(number|string)>} [options] - options to add to the given fields
     * @returns {this} 
     */
     time(field, options = {}) {
        return this.add(field, {...options, type: Time})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many id fields
     * @param {{[string]: Options<(number|string)>}} options
     * @returns {this}
     */
    times(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: Time}})
        )
        return this.addMany(Options)
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add a field of any type
     * @param {string} field - name of the field
     * @param {Options<T>} [options] - Options to add to the given field
     * @returns {this} 
     */
    any(field, options = {}) {
        return this.add(field, {...options, type: "any"})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many any fields
     * @param {{[string]: Options<T>}} options
     * @returns {this}
     */
    anys(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field], type: "any"}})
        )
        return this.addMany(Options)
    }
    /**
     * 
     * @param {string} field - key of the field
     * @param {Fields} options - the schema of the object to add
     * @returns {this}
     */
    object(field, options = {}) {
        if(options instanceof Fields) {
            this.add(field, options.setName(field).setParent(this))
        }
        return this
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many object fields
     * @param {{[string]: Fields}} options
     * @returns {this}
     */
    objects(options = {}) {
        Object.keys(options).forEach(field => {
            if(!options[field]) return
            this.object(field, options[field])
        })
        return this
    }
    /**
     * @author Subham Bhattacharjee
     * @description function to add a field of array
     * @param {string} field - name of the field
     * @param {OptionsForArray<T>} [options] - options to add to the givn
     * @returns {this} 
     */
    array(field, options = {}) {
        if(options instanceof Fields) {
            options.setParent(this).asArray()
            return this.add(field, options)
        }
        return this.add(field, {...options, type: ArrayOf(options.type ?? "any")})
    }

    /**
     * @author Subham Bhattacharjee
     * @description function to add many array fields
     * @param {{[string]: OptionsForArray<T>}} options
     * @returns {this}
     */
    arrays(options = {}) {
        const Options = Object.keys(options).reduce(
            (Options, field) => ({...Options, [field]: {...options[field]}, type: options instanceof Fields ? options.asArray().setParent() : (ArrayOf(options[field]?.type ?? "any"))})
        )
        return this.addMany(Options)
    }

    /**
     * @template ObjT
     * @param {ObjT} object - object to validate
     * @param {boolean} asType - check fieald as it's type namely array
     * @returns {Promise<{
     *  valid: boolean,
     *  error?: string,
     *  result?: ObjT
     * }>}
     */
    async validate(object, asType = true, index = null) {
        if(this.type === "array" && asType) {
            if(!Array.isArray(object)) return {valid: false, error: `${this.name} must be an array${this.name ? ` in ${this.parnt}` : ""}!`}

            let results = []

            for(const index in object) {
                const {valid, error, result} = await this.validate(object[index], false, index)
                if(!valid) {
                    return {valid, error, result}
                }
                results.push(result)
            }

            return {valid: true, error: null, result: results}
        }
        const result = deepCopy(object ?? {})
        for(const key in this.$schema) {
            if(this.$schema[key].required && object[key] == null) {
                const error = this.formatErrorMessage(key, `\$field\${name| at index } is required\${name| in } but not provided!`, index)
                return {
                    valid: false,
                    error, result
                }
            }
            if(object[key] == null) continue
            if(this.$schema[key] instanceof Fields) {
                if(typeof object[key] !== "object") {
                    const error = `${key} must be an object${this.name == null ? "" : ` in ${this.name}`}${this.name == null ? "" : ` at index ${index}`}!`
                    return {
                        valid: false,
                        error,
                        result
                    }
                }
                const {valid, error, result: Result} = await this.$schema[key].setCurrentRequest(this.currentRequest).validate(object[key], true, index)
                result[key] = Result
                if(!valid) return {valid, error, result}
                continue
            }
            for(const validation in this.$schema[key]) {
                const validRaw = (Fields.validationFunctions[validation] == null 
                    || this.$schema[key][validation] == null) 
                    ? true
                    : Fields.validationFunctions[validation](object[key], this.$schema[key][validation], key, result, this.currentRequest)
                const valid = validRaw instanceof Promise ? await validRaw : validRaw
                if(!valid) {
                    const error = this.formatErrorMessage(key, Fields.validationFunctions[validation].error instanceof Function ? Fields.validationFunctions[validation].error(this.$schema[key][validation]) : Fields.validationFunctions[validation].error, Fields.validationFunctions[validation]?.transformField(this.$schema[key][validation]) ?? this.$schema[key][validation], result[key]?._errorIndex ?? index)
                    return {
                        valid,
                        error,
                        result
                    }
                }
            }
        }
        return {valid: true, result}
    }
}

/**
 * @template ObjT
 * @param {string} name - name of the validation
 * @param {(actual: ObjT, value: T, key: string, parent: string, req: object) => boolean} ValidationCallback - callback to validate against given name
 * @param {(string|(value: T) => string)} ErrorMessage - error message
 * @param {(value: T) => string} [transformField] - transformer for the value of this field
 */
Fields.register = (name, ValidationCallback, ErrorMessage, transformField = field => field) => {
    if(!name) throw new Error("name must be given!")
    if(!ErrorMessage) throw new Error("Error message must be given")
    if(!ValidationCallback instanceof Function) throw new Error("validation callback is required and must be a function")
    if(!Fields.validationFunctions) Fields.validationFunctions = {}
    Fields.validationFunctions[name] = ValidationCallback
    Fields.validationFunctions[name].error = ErrorMessage
    Fields.validationFunctions[name].transformField = transformField
}

Fields.copy = field => {
    return new Fields(field.name, field.required, field.type, field)
}

module.exports = Fields