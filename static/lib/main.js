"use strict";
/*global utils, app*/

$(function() {
	$(window).on('action:ajaxify.end', function(e, data) {
		if (data.url === 'register' && utils.param('error') === 'not-filled') {
			app.alertError('Please complete all fields before registering.');
		}
	});
});