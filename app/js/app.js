window.App = Ember.Application.create();

App.Router.map(function () {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
	model: function () {
		return Ember.$.getJSON('https://api.github.com/users/intothev01d/repos').then(function(data) {
			console.log(data);
			return data;
		});
	}
});
