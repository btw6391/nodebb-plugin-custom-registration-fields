"use strict";

var customFields = {
        npi : "", 
        institution : "",
        practicetype : "",
        specialty : "",
        practiceyears : ""
    },
    currentUsername = "",
    user = module.parent.require('./user'),
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
    for(var key in customFields) {

        switch(key) {
            case 'npi':
                var label = "NPI #";
                break;
            
            case 'institution':
                var label = "Institution";
                break;
            
            case 'practicetype':
                var label = "Practice Type";
                break;
            
            case 'specialty':
                var label = "Specialty";
                break;
            
            case 'practiceyears':
                var label = "Practice Years";
                break;
        }
        
        headers.headers.push({
            label: label
        });
    }

    callback(null, headers);
};

plugin.customFields = function(params, callback) {    
    var users = params.users.map(function(user) {
        console.log("Old user: ");
        console.dir(user);

        if (user['username'] == currentUsername) {
            for(var key in customFields) {
                    user.customRows = [];

                    user.customRows.push({value: customFields[key]});

                    console.log("Adding to queue: " + customFields[key]);
                }
            }
        }
        return user;
        console.log("New user: ");
        console.dir(user);
    });

    callback(null, {users: users});
};

plugin.addField = function(params, callback) {
    for(var key in customFields) {
        
        if (key == "") {
            callback(null, params);
            return;
        }

        switch(key) {
            case 'npi':
                var html = '<input class="form-control" type="text" name="npi" id="npi" placeholder="Enter NPI #"><span class="custom-feedback" id="npi-notify"></span><span class="help-block">A unique 10-digit identification number.</span>';
                var label = "NPI #";
                break;
            
            case 'institution':
                var html = '<input class="form-control" type="text" name="institution" id="institution" placeholder="Enter Institution"><span class="custom-feedback" id="institution-notify"></span>';
                var label = "Institution";
                break;
            
            case 'practicetype':
                var html = '<select class="form-control" name="practicetype" id="practicetype"><option value="" disabled="" selected="">Select your practice type</option><option value="1">Academic</option><option value="2">Community</option><option value="3">Hospital</option></select><span class="custom-feedback" id="practice-notify"></span>';
                var label = "Practice Type";
                break;
            
            case 'specialty':
                var html = '<select class="form-control" name="specialty" id="specialty"><option value="" disabled="" selected="">Select your specialty</option><option value="1">Oncology</option><option value="2">Hematology</option><option value="3">Oncology/Hematology</option><option value="4">Radiation Oncology</option><option value="5">Nuclear Medicine</option></select><span class="custom-feedback" id="specialty-notify"></span>';
                var label = "Specialty";
                break;
            
            case 'practiceyears':
                var html = '<select class="form-control" name="practiceyears" id="practiceyears"><option value="" disabled="" selected="">Select your years in practice</option><option value="1">In Training</option><option value="2">1 to 3 Years</option><option value="3">4 to 7 Years</option><option value="4">8 to 10 Years</option><option value="5">&gt;10 Years</option></select><span class="custom-feedback" id="years-notify"></span>';
                var label = "Practice Years";
                break;
        }

        var captcha = {
            label: label,
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
    var userData = params.userData;
    var error = null;

    for(var key in customFields) {

        var value = userData[key];

        if (key == 'npi') {
            if (value.length != 10) {
                error = {message: 'NPI # must be 10 digits'};
            }
            else if (!/^[0-9]+$/.test(value)) {
                error = {message: 'NPI # must be a numerical value'};
            }
        }

        else if (value == "" || value == undefined) {
            error = {message: 'Please complete all fields before registering.'};
        }
    }

    callback(error, params);
};

plugin.createUser = function(params) {
    var keyID = 'user:' + params.uid + ':ns:custom_fields';

    db.setObject(keyID, customFields, function(err) {
        if (err) {
            return callback(err);
        }
    });

    console.dir(customFields);
};

plugin.addToApprovalQueue = function(params, callback) {
    var userData = params.data;
    console.log("Params: ");
    console.dir(params);

    currentUsername = userData['username'];

    for (var key in customFields) {

        switch(key) {
            case 'npi':
                var fieldData = params.userData['npi'];
                break;
            
            case 'institution':
                var fieldData = params.userData['institution'];
                break;
            
            case 'practicetype':
                var fieldData = params.userData['practicetype'];
                break;
            
            case 'specialty':
                var fieldData = params.userData['specialty'];
                break;
            
            case 'practiceyears':
                var fieldData = params.userData['practiceyears'];
                break;
        }
        
        customFields[key] = fieldData;
    }

    console.log("Custom field data added: ");
    console.dir(customFields);

    callback(null, {data: userData});
};

plugin.onRegisterComplete = function(data, callback) {
    data.referrer = 'https://http://45.55.167.216:4567/login';
    callback(null, data);
}

function renderAdmin(req, res, next) {
	res.render('admin/custom-registration-fields', {fields: customFields});
}

module.exports = plugin;
