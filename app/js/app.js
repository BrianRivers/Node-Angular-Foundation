App = Ember.Application.create();

App.Router.map(function () {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
	model: function () {
		return Ember.$.getJSON('http://localhost:3000').then(function(data) {
			console.log(data);
			return data;
		});
	}
});
