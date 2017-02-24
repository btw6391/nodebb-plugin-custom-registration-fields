"use strict";

var data = {
        'npi' : "", 
        'institution' : "",
        'practicetype' : "",
        'speciality' : "",
        'practiceyears': ""
    },
    User = module.parent.require('./user'),
	meta = module.parent.require('./meta'),
    db = module.parent.require('./database'),
    plugin = {};

plugin.init = function(params, callback) {
	var app = params.router,
		middleware = params.middleware,
		controllers = params.controllers;
		
	app.get('/admin/custom-registration-fields', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/custom-registration-fields', renderAdmin);

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/custom-registration-fields',
		icon: 'fa-tint',
		name: 'Custom Registration Fields'
	});

	callback(null, header);
};

plugin.customHeaders = function(headers, callback) {
    // for (var field in data) {
    //     headers.headers.push({
    //         label: '[[user:' + field + ']]',
    //     });
    // }

    var field = data.npi
    
    headers.headers.push({
        label: '[[user:' + field + ']]',
    });

    callback(null, headers);
};

plugin.customFields = function(params, callback) {
    var field = data.npi
    var users = params.users.map(function(user) {
        if (!user.customRows) {
            user.customRows = [];
        }
        user.customRows.push({value: user[field]});
        return user;
    });

    callback(null, {users: users});
};

plugin.addField = function(params, callback) {

    for(var field in data) {
        console.log("Field: " + field);
        
        if (field == "") {
            callback(null, params);
            return;
        }

        var html = '<input class="form-control" name="' + field + '" id="' + field + '" />';

        var captcha = {
            label: '[[user:' + field + ']]',
            html: html
        };

        if (params.templateData.regFormEntry && Array.isArray(params.templateData.regFormEntry)) {
            params.templateData.regFormEntry.push(captcha);
        } else {
            params.templateData.captcha = captcha;
        }
    }

    callback(null, params);
};

plugin.checkField = function(params, callback) {
    for(var field in data) {
        var answer = data[field];

        if (answer == "") {
            callback({source: 'custom-registration-fields', message: 'not-filled'}, params);
        } else {
            callback(null, params);
        }
    }
};

plugin.createUser = function(params, callback) {
    var userData = params.user;

    db.setObject('user:' + userData.uid + ':ns:custom_fields', data, function(err) {
        if (err) {
            return callback(err);
        }
    });

    callback(null, params);
};

plugin.addToApprovalQueue = function(params, callback) {
    for (var field in data) {
        var fieldData = params.userData[field];
        var userData = params.data;
        
        data[field] = fieldData;
    }

    callback(null, {data: data});
};

function renderAdmin(req, res, next) {
	res.render('admin/custom-registration-fields', {fields:fields});
}

module.exports = plugin;
