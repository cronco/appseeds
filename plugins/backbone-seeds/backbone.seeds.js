// Backbone.StateRouter
// --------------------
// *StateRouter* extends *Backbone.Router* for easy integration with *Seeds.StateManager*.
// It behaves like a normal Router, with one addition: when the associated state manager
// transitions to a new state, the router will navigate to the appropriate URL and viceversa.
//
// Usage:
//
//		var sm = Seeds.StateManager.create();
//		var router = new Backbone.StateRouter({
//			manager: sm,
//			routes: {
//				'some/route': 'state:A',
//				'some/other/route': 'state:B'
//			}
//		});
//
//	*sm* and *router* will now be in sync.
Backbone.StateRouter = Backbone.Router.extend({

	// Set up *Backbone.StateRouter*.
	constructor: function(options) {
		Backbone.Router.prototype.constructor.call(this, options);
		this.manager = options.manager;
		this._stateRoutes = {};
		if (this.manager) {
			var router = this;
			// Attach a listener to the *stay* event in the state manager.
			this.manager.sub('stay', function(stateName) {
				var route = router._stateRoutes[stateName];
				if (route) router.navigate(route);
			});
			// Attach a listener on all the router events, to see if they match the *route:state:stateName* format.
			this.on('all', function(route) {
				var ret = /^route:state:(.+)/.exec(route);
				if (ret) this.manager.go(ret[1]);
			});
		}
	},
	// Overwrite the *route()* method to keep a reference to routes with the name in the *state:stateName* format.
	route: function(route, name) {
		Backbone.Router.prototype.route.apply(this, arguments);
		var ret = /^state:(.+)/.exec(name);
		if (ret) this._stateRoutes[ret[1]] = route;
	}
});