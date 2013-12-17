App = Ember.Application.create({
	LOG_STACKTRACE_ON_DEPRECATION: true,
	LOG_BINDINGS: true,
	LOG_TRANSITIONS: true,
	LOG_TRANSITIONS_INTERNAL: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_ACTIVE_GENERATION: true
});

var BASE_URL = 'http://localhost:3001';

App.Router.map(function () {
	this.route('test');
});

App.IndexRoute = Ember.Route.extend({});

App.TestRoute = Ember.Route.extend({
	model: function() {
		return {
			id: '1',
			name: 'test',
			key: this.controllerFor('login').get('key')
		};
	}
});

App.LoginView = Ember.View.extend({
	didInsertElement : function(){
		this._super();
		var self = this;
		// when clicked away reset login properties
		$('#login-dropdown').on('hidden.bs.dropdown', function () {
			self.get('controller').send('reset');
		});
	}
});

App.LoginController = Ember.Controller.extend({
	username: null,
	password: null,
	actions: {
		// log user in
		login: function() {
			var self = this;
			var data = this.getProperties('username', 'password');

			// make sure no error appears
			self.set('error', null);

			// authenticate username and password against API
			Ember.$.post(BASE_URL+'/authenticate', data).then( function (res) {
				// remove entry from login input
				self.send('reset');

				// check for successful login
				if (res.status.success) {
					$('#login-dropdown').removeClass('open');
					self.set('key', res.data.key);
				} else {
					self.set('error', res.status.message);
				}
			});
		},
		// reset login form properties
		reset: function() {
			this.setProperties({ username: null, password: null });
		}
	}
});