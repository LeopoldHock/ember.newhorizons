//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-28
// Description:
// Route that users are directed to when clicking the verification link in
// the account verificiation email.
//----------------------------------------------------------------------------//
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'new-horizons/config/environment';

export default class MainRequestVerifyRoute extends Route {
    @service manager;

    beforeModel(transition) {
        // Read the URL header and attempt to fetch a verification key
        let parameters = this.manager.getUrlParameters(transition.intent.url);
        let verificationCode = parameters.find(element => element.key === "code");
        if (!verificationCode) {
            // if verification code is missing, redirect to home
            this.manager.goToRoute("home");
            return;
        }
        // do a fetch using the code
        let that = this;
        fetch(ENV.APP.apiUrl + "/" + ENV.APP.apiNamespace + "/email-verifications/" + verificationCode.value, {
            method: 'GET',
            headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" },
        }).then(function (response) {
            that.manager.goToRoute("home");
            // by default, prepare an error message and ask the user to try again later
            let modalType = { "name": "type", "value": "error" };
            let modalTitle = { "name": "title", "value": "Misc_Sorry" };
            let modalText = { "name": "text", "value": ["Modal_EmailVerificationError_Text01"] };
            let yesLabel = { "name": "yesLabel", "value": "Misc_Ok" };
            if (response.status === 200) {
                that.manager.goToRoute("sign-in");
                modalType = { "name": "type", "value": "success" };
                modalTitle = { "name": "title", "value": "Modal_EmailVerificationSuccess_Title" };
                modalText = { "name": "text", "value": ["Modal_EmailVerificationSuccess_Text01"] };
            }
            that.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel]);
        })
    }
}
