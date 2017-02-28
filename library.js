"use strict";

var customFields = {
        npi : "", 
        institution : "",
        practicetype : "",
        speciality : "",
        practiceyears : ""
    },
    user = module.parent.require('./user'),
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
    for(var key in customFields) {
        // var fieldText = key + ':field';
        // var field = meta.config[fieldText];

        switch(key) {
            case 'npi':
                var field = meta.config['npi:field'];
                break;
            
            case 'institution':
                var field = meta.config['institution:field'];
                break;
            
            case 'practicetype':
                var field = meta.config['practicetype:field'];
                break;
            
            case 'speciality':
                var field = meta.config['speciality:field'];
                break;
            
            case 'practiceyears':
                var field = meta.config['practiceyears:field'];
                break;
        }
        
        headers.headers.push({
            label: '[[user:' + field + ']]',
        });

        console.log("Custom Header: " + field);
    }

    callback(null, headers);
};

plugin.customFields = function(params, callback) {
    for(var key in customFields) {
        // var fieldText = key + ':field';
        // var field = meta.config[fieldText];

        switch(key) {
            case 'npi':
                var field = meta.config['npi:field'];
                break;
            
            case 'institution':
                var field = meta.config['institution:field'];
                break;
            
            case 'practicetype':
                var field = meta.config['practicetype:field'];
                break;
            
            case 'speciality':
                var field = meta.config['speciality:field'];
                break;
            
            case 'practiceyears':
                var field = meta.config['practiceyears:field'];
                break;
        }
        
        var users = params.users.map(function(user) {
            if (!user.customRows) {
                user.customRows = [];
            }
            user.customRows.push({value: user[field]});
            return user;
        });

        console.log("Custom Field: " + user[field]);
    }

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
                var html = '<input class="form-control" name="npi" id="npi" />';
                var label = "NPI #";
                break;
            
            case 'institution':
                var html = '<input class="form-control" name="institution" id="institution" />';
                var label = "Institution";
                break;
            
            case 'practicetype':
                var html = '<select class="form-control" name="practicetype" id="practicetype"><option value="" disabled selected>Select your practice type</option><option value="1">Academic</option><option value="2">Community</option><option value="3">Hospital</option></select>';
                var label = "Practice Type";
                break;
            
            case 'speciality':
                var html = '<select class="form-control" name="speciality" id="speciality"><option value="" disabled selected>Select your specialty</option><option value="1">Oncology</option><option value="2">Hematology</option><option value="3">Oncology/Hematology</option><option value="4">Radiation Oncology</option><option value="5">Nuclear Medicine</option></select>';
                var label = "Speciality";
                break;
            
            case 'practiceyears':
                var html = '<select class="form-control" name="practiceyears" id="practiceyears"><option value="" disabled selected>Select your years in practice</option><option value="1">In Training</option><option value="2">1 to 3 Years</option><option value="3">4 to 7 Years</option><option value="4">8 to 10 Years</option><option value="5">&gt;10 Years</option></select>';
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
    for(var key in customFields) {
        // var answerText = key + ':answer';
        // var answer = meta.config[answerText];

        // console.log("Answer: " + answerText);

        switch(key) {
            case 'npi':
                var answer = meta.config['npi:answer'];
                break;
            
            case 'institution':
                var answer = meta.config['institution:answer'];
                break;
            
            case 'practicetype':
                var answer = meta.config['practicetype:answer'];
                break;
            
            case 'speciality':
                var answer = meta.config['speciality:answer'];
                break;
            
            case 'practiceyears':
                var answer = meta.config['practiceyears:answer'];
                break;
        }

        if (answer == "") {
            callback({source: answer, message: 'not-filled'}, params);
        }

        console.log("Answer: " + answer);
    }

    callback(null, params);
};

plugin.createUser = function(params, callback) {
    var userData = params.user;
    console.log("User ID: " + userData.uid);

    for(var key in customFields) {
        // var fieldText = key + ':field';
        // var field = meta.config[fieldText];
        // var fieldData = params.data[field] || params.data[key];

        switch(key) {
            case 'npi':
                var field = meta.config['npi:field'];
                var fieldData = params.data[field] || params.data['npi'];
                break;
            
            case 'institution':
                var field = meta.config['institution:field'];
                var fieldData = params.data[field] || params.data['institution'];
                break;
            
            case 'practicetype':
                var field = meta.config['practicetype:field'];
                var fieldData = params.data[field] || params.data['practicetype'];
                break;
            
            case 'speciality':
                var field = meta.config['speciality:field'];
                var fieldData = params.data[field] || params.data['speciality'];
                break;
            
            case 'practiceyears':
                var field = meta.config['practiceyears:field'];
                var fieldData = params.data[field] || params.data['practiceyears'];
                break;
        }

        if (!userData[field] && fieldData && fieldData != "") {
            userData[field] = fieldData;
            customFields[key] = fieldData;
        }
    }

    // db.setObject('user:' + userData.uid + ':ns:custom_fields', customFields, function(err) {
    //     if (err) {
    //         return callback(err);
    //     }
    // });

    console.log("Custom Fields: " + customFields);
    console.dir(userData);

    user.getUsers([2], 1, function(err, users) {
        console.log(users);
    });

    callback(null, userData);
};

plugin.addToApprovalQueue = function(params, callback) {
    var userData = params.data;

    for (var key in customFields) {
        // var fieldText = key + ':field';
        // var field = meta.config[fieldText];

        switch(key) {
            case 'npi':
                var field = meta.config['npi:field'];
                var fieldData = params.userData['npi'];
                break;
            
            case 'institution':
                var field = meta.config['institution:field'];
                var fieldData = params.userData['institution'];
                break;
            
            case 'practicetype':
                var field = meta.config['practicetype:field'];
                var fieldData = params.userData['practicetype'];
                break;
            
            case 'speciality':
                var field = meta.config['speciality:field'];
                var fieldData = params.userData['speciality'];
                break;
            
            case 'practiceyears':
                var field = meta.config['practiceyears:field'];
                var fieldData = params.userData['practiceyears'];
                break;
        }

        // var fieldData = params.userData[key];
        
        userData[field] = fieldData;
        customFields[key] = fieldData;

        console.log("Field data: " + fieldData);
    }

    console.dir(userData);
    console.log(customFields);

    callback(null, {data: userData});
};

function renderAdmin(req, res, next) {
	res.render('admin/custom-registration-fields', {fields: customFields});
}

module.exports = plugin;
