//----------------------------------------------------------------------------//
// Leopold Hock / 2021-02-28
// Description:
// Simplge parent route that holds routes used to send requests to the backend.
// Redirects to 'page not found'.
//----------------------------------------------------------------------------//
import Route from '@ember/routing/route';

export default class RequestRoute extends Route {
    redirect() {
        //this.transitionTo('home');
    }
}
