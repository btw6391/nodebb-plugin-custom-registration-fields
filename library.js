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
    for(var key in data) {
        var field = key;
        headers.headers.push({
            label: '[[user:' + field + ']]',
        });
    }

    callback(null, headers);
};

plugin.customFields = function(params, callback) {
    for(var key in data) {
        var field = key;
        var users = params.users.map(function(user) {
            if (!user.customRows) {
                user.customRows = [];
            }
            user.customRows.push({value: user[field]});
            return user;
        });
    }

    callback(null, {users: users});
};

plugin.addField = function(params, callback) {
    for(var key in data) {
        var field = key;
        console.log("Field: " + field);
        
        if (field == "") {
            callback(null, params);
            return;
        }

        if (field === 'practicetype') {
            var html = '<select class="form-control" name="field_practicetype"><option value="default" disabled="disabled">Select your practice type</option><option value="1">Academic</option><option value="2">Community</option><option value="3">Hospital</option></select>';
        }

        else if (field === 'speciality') {
            var html = '<select class="form-control" name="field_specialty"><option value="default" disabled="disabled">Select your specialty</option><option value="1">Oncology</option><option value="2">Hematology</option><option value="3">Oncology/Hematology</option><option value="4">Radiation Oncology</option><option value="5">Nuclear Medicine</option></select>';
        }

        else if (field === 'practiceyears') {
            var html = '<select class="form-control" name="field_practiceyears"><option value="default" disabled="disabled">Select your years in practice</option><option value="1">In Training</option><option value="2">1 to 3 Years</option><option value="3">4 to 7 Years</option><option value="4">8 to 10 Years</option><option value="5">&gt;10 Years</option></select>';
        }

        else {
            var html = '<input class="form-control" name="' + field + '" id="' + field + '" />';
        }

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
    for(var key in data) {
        var answer = data[key];

        if (answer == "") {
            callback({source: 'custom-registration-fields', message: 'not-filled'}, params);
        } else {
            callback(null, params);
        }
    }
};

plugin.createUser = function(params, callback) {
    var userData = params.user;
    console.log("User Data: " + userData);

    for(var key in data) {
        var field = key;
        var fieldData = params.data[field];

        if (fieldData && fieldData != "") {
            data[key] = fieldData;
        }
    }

    db.setObject('user:' + userData.uid + ':ns:custom_fields', data, function(err) {
        if (err) {
            return callback(err);
        }
    });

    callback(null, userData);
};

plugin.addToApprovalQueue = function(params, callback) {
    var userData = params.data;
    console.log("User Data: " + userData);

    for (var key in data) {
        var field = key;
        var fieldData = params.userData[field];
        
        userData[field] = fieldData;
        data[field] = fieldData;
    }

    callback(null, {data: userData});
};

function renderAdmin(req, res, next) {
	res.render('admin/custom-registration-fields', {fields: data});
}

module.exports = plugin;
