import EmberRouter from '@ember/routing/router';
import config from 'new-horizons/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Flat routes on the main level for general functionality
  this.route('home', { path: '' });
  this.route('news');
  this.route('support');
  this.route('imprint');
  this.route('sign-up');
  this.route('sign-in');
  this.route('settings');
  // The 'request' route holds any routes that are served only to send small requests to the backend
  this.route('request', function () {
    this.route('verify');
    this.route('reset-password');
  });
  // The Stellarpedia
  this.route('stellarpedia', { path: '/stellarpedia/:full_entry_adress' });
  // this.route('stellarpedia', function () {
  //   this.route("article", { path: '/:full_entry_adress' });
  // });
  this.route('generator', function () {
    this.route('preset');
    this.route('origin');
    this.route('origin-select', { path: 'origin/:reduced_origin_id' });
    this.route('personal');
    this.route('attributes');
    this.route('traits');
    this.route('skills');
    this.route('abilities');
    this.route('apps');
    this.route('inventory');
    this.route('finish');
  });
  // The character editor
  this.route('editor');
  this.route('page-not-found', { path: '/*' });
});
