import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'new-horizons/config/environment';

export default class MainRequestResetPasswordRoute extends Route {
    @service manager;

    async model(params, transition) {
        // Read the URL header and attempt to fetch a rest password code
        let parameters = this.manager.getUrlParameters(transition.intent.url);
        let resetPasswordCode = parameters.find(element => element.key === "code");
        if (!resetPasswordCode) {
            // if verification code is missing, redirect to home
            this.manager.goToRoute("home");
            return;
        }
        // check with the backend whether the code is valid and belongs to a user
        let that = this;
        let result = await fetch(ENV.APP.apiUrl + "/" + ENV.APP.apiNamespace + "/password-resets/" + resetPasswordCode.value, {
            method: 'GET',
            headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" },
        }).then(
            function (response) {
                if (response.status === 200) {
                    // if the response code is valid, save the code
                    return { resetPasswordCode: resetPasswordCode };
                } else {
                    // else, redirect to home
                    return undefined;
                }
            }
        );
        if (result) return result;
        else that.manager.goToRoute("home");
    }
}
