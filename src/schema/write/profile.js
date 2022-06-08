const {Fields} = require("../../middleware").typedValidation

const $getAssets = new Fields()
    .number("page")
    .number("limitBy")

module.exports = {$getAssets}