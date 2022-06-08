'use strict';

define('forum/sdlms/cohort', ['api', 'sdlms/cohort', 'sdlms/users'], function (api) {
	var COHORT = {};

    COHORT.cohort = ajaxify.data.cohort;
    COHORT.members = ajaxify.data.members;
    
	COHORT.init = function () { 
        let members = COHORT.members.map((member) => {
            return { uid: member.uid, fullname: member.fullname || member.username || member.displayname }
            });
            
        new Cohort ({
            target: '.cohort-area',
            with: { ...COHORT.cohort, members: members },
            slug: COHORT.cohort.slug,
            name: COHORT.cohort.name,
            isEditor: true,
            action: 'reader'
        })
    }

    return COHORT;
});