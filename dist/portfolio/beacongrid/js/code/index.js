(function() {

	// for background video
	var options = {
		resize: true,
		align: "center",
		valign: "center"
	};
	var bgVideo = bgVideo3230('#multi-video video', options);

	// create multi-video player;
	var beatconPlayer = new BeatconMultiVideoPlayer();


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

	App.Models.Home = Backbone.Model.extend({});

	App.Views.HomeView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-home',
		template: template('pg-home'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	App.Views.PricingView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-pricing',
		template: template('pg-pricing'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	App.Views.BenefitsView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-benefits',
		template: template('pg-benefits'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	App.Views.UseCasesView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-use-cases',
		template: template('pg-use-cases'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	App.Views.EnterpriseView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-enterprise',
		template: template('pg-enterprise'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	App.Views.ContactsView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-contacts',
		template: template('pg-contacts'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

		App.Views.TabContactsView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-contacts'),

			render: function() {
				this.$el.addClass('v-contacts').html( this.template() );
				return this;
			}
		});

		App.Views.TabPrivacyPolicyView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-privacy-policy'),

			render: function() {
				this.$el.addClass('v-terms').html( this.template() );
				return this;
			}
		});

		App.Views.TabServiceTermsView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-service-terms'),

			render: function() {
				this.$el.addClass('v-terms').html( this.template() );
				return this;
			}
		});

	App.Views.GetStartedView = Backbone.View.extend({
		tagName: 'div',
		className: 'pg-get-started',
		template: template('pg-get-started'),

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

		App.Views.BeaconsView = Backbone.View.extend({
			tagName: 'div',
			className: 'b-inside-page',
			template: template('tab-beacons'),

			render: function() {
				this.$el.html( this.template() );
				return this;
			}
		});

	App.Views.Login = Backbone.View.extend({
		tagName: 'div',
		className: 'modal-login',
		template: template('modal-login'),

		render: function() {
			this.$el.html( this.template() );
			return this;
		}
	});

	var homeView 	   = new App.Views.HomeView(),
		pricingView    = new App.Views.PricingView(),
		benefitsView   = new App.Views.BenefitsView(),
		useCasesView   = new App.Views.UseCasesView(),
		enterpriseView = new App.Views.EnterpriseView(),
		contactsView   = new App.Views.ContactsView(),
			tabContactsView 	 = new App.Views.TabContactsView(),
			tabPrivacyPolicyView = new App.Views.TabPrivacyPolicyView(),
			tabServiceTermsView  = new App.Views.TabServiceTermsView(),
		getStartedView = new App.Views.GetStartedView(),
			addBeaconsView 	  = new App.Views.AddBeaconsView(),
			beaconsView 	  = new App.Views.BeaconsView(),

		// modal login
		loginView 	   = new App.Views.Login();

	App.Router = Backbone.Router.extend({
		routes: {
			""			  : "home",
			"index"		  : "home",
			"pricing"	  : "pricing",
			"benefits"	  : "benefits",
			"use_cases"	  : "useCases",
			"enterprise"  : "enterprise",
			"contacts"	  : "contacts",
				"contacts/contacts" 		  : "tabContacts",
				"contacts/privacy_and_policy" : "tabPrivacyPolicy",
				"contacts/terms_of_service"   : "tabServiceTerms",
			"get_started" : "getStarted",
				"get_started/add_beacons"  : "addBeacons",
				"get_started/beacons"	   : "beacons",

			// modal login
			"login"		: "login"
		},

		home: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(homeView.render().el);

			$('.c-nav > a').eq(0).addClass('active')
			.siblings().removeClass('active');			

			bgVideo.init();			
			//todo: add bgVideo.destruct() in handler changes pages

			// initilization multi-video player;
			beatconPlayer.init();
			// todo: add beatconPlayer.destruct() in handler changes pages	
		},

		pricing: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(pricingView.render().el);
			
			$('.c-nav > a').eq(1).addClass('active')
			.siblings().removeClass('active');
		},

		enterprise: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(enterpriseView.render().el);
			
			$('.c-nav > a').eq(2).addClass('active')
			.siblings().removeClass('active');
		},

		contacts: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(contactsView.render().el);
			
			$('.c-nav > a').eq(3).addClass('active')
			.siblings().removeClass('active');

			$('.b-inside-page').remove();
			$('.c-list-inside-pages > li').eq(0).addClass('active')
				.siblings().removeClass('active');
			$('.c-list-inside-pages').after(tabContactsView.render().el);
		},

			tabContacts: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(contactsView.render().el);
					
					$('.c-nav > a').eq(3).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(0).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(tabContactsView.render().el);
			},

			tabPrivacyPolicy: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(contactsView.render().el);
					
					$('.c-nav > a').eq(3).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(1).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(tabPrivacyPolicyView.render().el);
			},

			tabServiceTerms: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(contactsView.render().el);
					
					$('.c-nav > a').eq(3).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(2).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(tabServiceTermsView.render().el);
			},

		getStarted: function () {
			$('.b-main-content').html('');
			$('.b-main-content').append(getStartedView.render().el);
			
			$('.c-nav > a').eq(4).addClass('active')
			.siblings().removeClass('active');

			$('.b-inside-page').remove();
			$('.c-list-inside-pages > li').eq(0).addClass('active')
				.siblings().removeClass('active');
			$('.c-list-inside-pages').after(addBeaconsView.render().el);
		},

			addBeacons: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(getStartedView.render().el);
					
					$('.c-nav > a').eq(4).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(0).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(addBeaconsView.render().el);
			},

			beacons: function () {

				if ( !$('.c-list-inside-pages').length ) {
					$('.b-main-content').html('');
					$('.b-main-content').append(getStartedView.render().el);
					
					$('.c-nav > a').eq(4).addClass('active')
					.siblings().removeClass('active');
				}

				$('.b-inside-page').remove();
				$('.c-list-inside-pages > li').eq(1).addClass('active')
					.siblings().removeClass('active');
				$('.c-list-inside-pages').after(beaconsView.render().el);
			},

		// modal login
		login: function () {
			//$('.b-main-content').html('');
			$('.b-main-content').after(loginView.render().el);

			var $checkedBlock = $('.b-main-content').find('div, section, [class*=pg-]');
			if($checkedBlock[0]){
				$('.js-back').addClass('on');
			}

			var $formSignup = $('.tab-signup form');
			
			$formSignup.on('submit', function(){
				var data = $(this).serializeArray();
				console.log('test');
				$.ajax({
					type: "POST",
					url: 'http://54.149.210.215/CreateUser.php',
					jsonp: "callback",
					crossOrigin: true,
					data: {
						jsonData: {
						"UserName": "AllenMann",
						"Password": "S3cretPassword"
						}
					},
					// Work with the response
					success: function( response ) {
						console.log( response ); // server response
					}
				});
				//console.log(data);
				return false;
			});			
		}
	});

	new App.Router;  // ???
	Backbone.history.start();
}());