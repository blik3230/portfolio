(function() {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	// helpers
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

	App.Views.AccountView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-account',
		template: template('pg-account'),

		render: function() {
			this.$el.html( this.template() );
	        return this;
		}
	});

	App.Views.BeaconsView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-beacons',
		template: template('pg-beacons'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

		App.Views.AddBeaconsView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-add-beacons'),

			render: function() {
				this.$el.html( this.template() );
				return this;
			}
		});

		App.Views.BeaconsListView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-beacons'),

			render: function() {
				this.$el.html( this.template() );
				return this;
			}
		});

			App.Views.BeaconView = Backbone.View.extend({
				tagName: 'div',
				className: 'pg-beacon',
				template: template('pg-beacon'),

				render: function() {
					this.$el.html( this.template() );
					return this;
				}
			});

	App.Views.AnalyticsView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-analytics',
		template: template('pg-analytics'),

		render: function() {
			this.$el.html( this.template() );
	        return this;
		}
	});

	App.Views.DevKeysView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-dev-keys',
		template: template('pg-dev-keys'),

		render: function() {
			this.$el.html( this.template() );
	        return this;
		}
	});

	App.Views.SupportView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-support',
		template: template('pg-support'),

		render: function() {
			this.$el.html( this.template() );
	        return this;
		}
	});

	var accountView   = new App.Views.AccountView(),
		beaconsView   = new App.Views.BeaconsView(),
			addBeaconsView 	  = new App.Views.AddBeaconsView(),
			beaconsListView 	  = new App.Views.BeaconsListView(),
		beaconView    = new App.Views.BeaconView(),
		analyticsView = new App.Views.AnalyticsView(),
		devKeysView   = new App.Views.DevKeysView(),
		supportView   = new App.Views.SupportView();

	App.Router = Backbone.Router.extend({
		routes: {
			"" 			: "account",
			"account"   : "account",
			"beacons"	: "beacons",
				"beacons/add_beacons"  : "addBeacons",
				"beacons/beacons"	   : "beaconsList",
				"beacons/item"		   : "beacon",
			"analytics" : "analytics",
			"dev_keys"  : "devKeys",
			"support"   : "support"
		},

		account: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(accountView.render().el);

			$('.c-nav > a').eq(0).addClass('active')
			.siblings().removeClass('active');
		},

		beacons: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(beaconsView.render().el);
			
			$('.c-nav > a').eq(1).addClass('active')
			.siblings().removeClass('active');

			$('.b-inside-page').remove();
			$('.c-list-inside-pages > li').eq(0).addClass('active')
				.siblings().removeClass('active');
			$('.c-list-inside-pages').after(addBeaconsView.render().el);
		},

			addBeacons: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(beaconsView.render().el);
					
					$('.c-nav > a').eq(1).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(0).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(addBeaconsView.render().el);
			},

			beaconsList: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(beaconsView.render().el);
					
					$('.c-nav > a').eq(1).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(1).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(beaconsListView.render().el);
			},

				beacon: function () {
					$('.b-main-content').html('');
					$('.b-main-content').append(beaconView.render().el);
					
					$('.c-nav > a').eq(1).addClass('active')
					.siblings().removeClass('active');
				},

		analytics: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(analyticsView.render().el);
			
			$('.c-nav > a').eq(2).addClass('active')
			.siblings().removeClass('active');
		},

		devKeys: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(devKeysView.render().el);
			
			$('.c-nav > a').eq(3).addClass('active')
			.siblings().removeClass('active');
		},

		support: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(supportView.render().el);
			
			$('.c-nav > a').eq(4).addClass('active')
			.siblings().removeClass('active');
		}
	});

	new App.Router;
	Backbone.history.start();
}());