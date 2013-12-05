App = Ember.Application.create({
	LOG_STACKTRACE_ON_DEPRECATION: true,
	LOG_BINDINGS: true,
	LOG_TRANSITIONS: true,
	LOG_TRANSITIONS_INTERNAL: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_ACTIVE_GENERATION: true
});

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
		$('#login-dropdown').on('hidden.bs.dropdown', function () {
			self.get('controller').send('reset');
		});
	}
});

App.LoginController = Ember.Controller.extend({
	username: null,
	password: null,
	actions: {
		login: function() {
			var self = this, data = this.getProperties('username', 'password');
			self.set('error', null);
			Ember.$.post('authenticate', data).then( function (res) {
				if (res.status.success) {
					self.set('key', res.data.key);
					console.log(self.key);
				} else {
					self.set('error', res.status.message);
					self.send('reset');
				}
			});
		},
		reset: function() {
			this.setProperties({
				username: null,
				password: null
			});
		}
	}
});