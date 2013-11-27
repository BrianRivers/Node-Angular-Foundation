App = Ember.Application.create({
	LOG_STACKTRACE_ON_DEPRECATION: true,
	LOG_BINDINGS: true,
	LOG_TRANSITIONS: true,
	LOG_TRANSITIONS_INTERNAL: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_ACTIVE_GENERATION: true
});

App.Router.map(function () {
	this.route("login");
});

App.IndexRoute = Ember.Route.extend({
	model: function () {
		return Ember.$.getJSON('https://api.github.com/users/intothev01d/repos').then(function(data) {
			console.log(data);
			return data;
		});
	}
});

App.LoginRoute = Ember.Route.extend({});