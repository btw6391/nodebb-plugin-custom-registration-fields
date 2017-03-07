"use strict";
/*global utils, app*/

$(window).on('action:register.submit', function() {

	var validationError = false;
	var successIcon = '';

	var npi = $('#npi');
	var institution = $('#institution');
	var practicetype = $('#practicetype');
	var specialty = $('#specialty');
	var practiceyears = $('#practiceyears');
	var register = $('#register');

	npi.on('blur', function () {
		if (npi.val().length) {
			validateNPI(npi.val());
		}
	});

	institution.on('blur', function () {
		if (institution.val().length) {
			validateInstitution(institution.val());
		}
	});

	practicetype.on('blur', function () {
		if (practicetype.val().length) {
			validatePracticeType(practicetype.val());
		}
	});

	specialty.on('blur', function () {
		if (specialty.val().length) {
			validateSpecialty(specialty.val());
		}
	});

	practiceyears.on('blur', function () {
		if (practiceyears.val().length) {
			validatePracticeYears(practiceyears.val());
		}
	});


	function validateForm(callback) {
		validationError = false;

		validateNPI(npi.val());
		validateInstitution(institution.val());
		validatePracticeType(practicetype.val());
		validateSpecialty(specialty.val());
		validatePracticeYears(practiceyears.val());
	}

	register.on('click', function (e) {
		var registerBtn = $(this);
		var errorEl = $('#register-error-notify');
		
		errorEl.addClass('hidden');
		e.preventDefault();

		validateForm(function () {
			if (validationError) {
				return;
			}

			registerBtn.addClass('disabled');

			registerBtn.parents('form').ajaxSubmit({
				headers: {
					'x-csrf-token': config.csrf_token,
				},
				success: function (data) {
					registerBtn.removeClass('disabled');
					if (!data) {
						return;
					}
					if (data.referrer) {
						window.location.href = data.referrer;
					} else if (data.message) {
						bootbox.alert(msg);
						ajaxify.go('/');
					}
				},
				error: function (data) {
					if (data.status === 403 && data.responseText === 'Forbidden') {
						window.location.href = config.relative_path + '/register?error=csrf-invalid';
					} else {
						errorEl.find('p').text(data.responseText);
						errorEl.removeClass('hidden');
						registerBtn.removeClass('disabled');
					}
				},
			});
		});
	});

	function validateNPI(npi) {
	    var npi_notify = $('#npi-notify');

	    if (npi.length != 10) {
	        showError(npi_notify, 'Must be 10 digits');
	    } else if (!/^[0-9]+$/.test(npi)) {
	        showError(npi_notify, 'Must be a numerical value');
	    } else {
	        showSuccess(npi_notify, successIcon);
	    }
	}

	function validateInstitution(institution) {
	    var institution_notify = $('#institution-notify');

	    if (institution.length < 1) {
	        showError(institution_notify, 'Must include an institution');
	    } else {
	        showSuccess(institution_notify, successIcon);
	    }
	}

	function validatePracticeType(practicetype) {
	    var practicetype_notify = $('#practicetype-notify');

	    if (practicetype.length < 1) {
	        showError(practicetype_notify, 'Must choose a practice type');
	    } else {
	        showSuccess(practicetype_notify, successIcon);
	    }
	}

	function validateSpecialty(specialty) {
	    var specialty_notify = $('#specialty-notify');

	    if (specialty.length < 1) {
	        showError(specialty_notify, 'Must choose a specialty');
	    } else {
	        showSuccess(specialty_notify, successIcon);
	    }
	}

	function validatePracticeYears(practiceyears) {
	    var practiceyears_notify = $('#practiceyears-notify');

	    if (practiceyears.length < 1) {
	        showError(practiceyears_notify, 'Must choose a year range');
	    } else {
	        showSuccess(practiceyears_notify, successIcon);
	    }
	}

	function showError(element, msg) {
		element.html(msg);
		element.parent()
			.removeClass('register-success')
			.addClass('register-danger');
		element.show();

		validationError = true;
	}

	function showSuccess(element, msg) {
		element.html(msg);
		element.parent()
			.removeClass('register-danger')
			.addClass('register-success');
		element.show();
	}
});