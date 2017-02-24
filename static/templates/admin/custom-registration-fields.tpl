<h1>Add Registration Fields</h1>
<hr />

<form>
	<p>
		Select user profile field user should fill in during registration
	</p><br />
	<div class="alert alert-info">
		<p>
			<label for="Field">Field:&nbsp;</label>
            <select data-field="add-registration-fields:field" class="profile-field-select">
                <option value="">Nothing</option>
                <!-- BEGIN fields -->
                <option value="@value">@value</option>
                <!-- END fields -->
            </select>

		</p>
	</div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
	require(['admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>
