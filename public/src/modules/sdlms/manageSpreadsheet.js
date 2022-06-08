"use strict"
/// just for refrence
define("sdlms/manageSpreadsheet", [
	'api', "sdlms/manageSpreadheet","sdlms/sharer"
], function (api, eb, threadbuilder, feedbacks) {

    let SPR = {};
    let sp = ajaxify.data.spreadsheet;
    SPR.init = function () {
        new spreadSheet({
            target: '#studentSpreadSheetBuilder',
            action: "builder",
            tid: sp.tid,
            uid: sp.uid,
            pid: sp.pid,
            with: sp.data,
            topic:sp.topic,
        });

        
    }
    return SPR;

});