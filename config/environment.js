'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'new-horizons',
    environment,
    rootURL: '/',
    locationType: 'history',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'liveReloadPort' 'unsafe-inline' 'unsafe-eval'",
      'font-src': "'self'",
      'connect-src': "'self' 'liveReloadPort' 'localhost'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      apiUrl: "https://api.new-horizons-game.com",
      apiNamespace: "api/v1",
      apiSuffix: "",
      stellarpediaUrl: "/assets/stellarpedia/",
    },
    ['ember-simple-auth-token']: {
      serverTokenEndpoint: '/auth/login', // Server endpoint to send authenticate request
      tokenPropertyName: 'access_token', // Key in server response that contains the access token
      headers: {}, // Headers to add to the request
      refreshAccessTokens: false, // Enables access token refreshing
      tokenExpirationInvalidateSession: true, // Enables session invalidation on token expiration
      serverTokenRefreshEndpoint: '/auth/refresh', // Server endpoint to send refresh request
      refreshTokenPropertyName: 'refresh_token', // Key in server response that contains the refresh token
      tokenExpireName: 'exp', // Field containing token expiration
      refreshLeeway: 0 // Amount of time to send refresh request before token expiration
    }
  };

  if (environment === 'development') {
    ENV['ember-simple-auth-token'].serverTokenEndpoint = "http://laravel.newhorizons/auth/login";
    //ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = "http://laravel.newhorizons/auth/refresh";
    ENV.APP.apiUrl = "http://laravel.newhorizons";
    ENV.APP.apiNamespace = "api/v1";
    ENV.APP.usingCors = true;
    ENV.APP.corsWithCreds = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.APP.apiUrl = "https://api.new-horizons-game.com";
    ENV.APP.apiNamespace = "api/v1";
    ENV.APP.usingCors = true;
    ENV.APP.corsWithCreds = true;
    ENV['ember-simple-auth-token'].serverTokenEndpoint = "https://api.new-horizons-game.com/auth/login";
    //ENV['ember-simple-auth-token'].serverTokenRefreshEndpoint = "http://laravel.newhorizons/auth/refresh";
    ENV.APP.usingCors = true;
    ENV.APP.corsWithCreds = true;
    ENV.contentSecurityPolicy = {
      'default-src': "'self'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self'",
      'media-src': "'self'"
    };
  }

  return ENV;
};
