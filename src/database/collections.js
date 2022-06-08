/**
 * @date 30-04-2022
 * @author imshawan
 * @description This file contains all the valid collections in the database.
 * Please use this file for adding the new collection names here.
 */

const DEFAULT = 'objects'; // Default collection name used by nodebb

const SDLMS = {
	CURRICULUM: 'curriculums',
    THREADBUILDER: 'threadbuilders',
    ARTICLES_HOME: 'articles_home',
    TEACHING_STYLE: 'teaching_styles',
    POLL: 'polls',
};

const MOBILE = {

};

const DT_THON = {

};

const PAYMENTS = {
    MODULEPURCHASEORDERS:'module_purchase_orders', //only get
    MODULES:'modules', /*restricted crud*/
    COCREDORDERS:'cocred_orders', //only get
    PRICELIST:'price_list',/*restricted crud*/
    COCREDDETAILS:'cocred_details', // only get
    COCREDPRODUCTS:'cocred_products' /*restricted crud*/
};
const PROFILE = {
    MAIN: "profile"
}


module.exports = {
    DEFAULT, SDLMS, MOBILE, DT_THON, PAYMENTS
};
