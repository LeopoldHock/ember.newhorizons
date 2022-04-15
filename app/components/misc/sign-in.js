import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import ENV from 'new-horizons/config/environment';
import classic from 'ember-classic-decorator';

@classic
export default class SignInComponent extends Component {
    @service manager;
    @service session;
    @tracked data = {};
    @tracked changeset = Changeset(this.data);
    @tracked submitIsBusy = false;

    @action onSubmit(event) {
        event.preventDefault();
        let form = event.srcElement;
        if (form.checkValidity()) {
            this.authenticate(this.changeset.get("email"), this.changeset.get("passwordRaw"));
        }
    }

    @action async authenticate(email, password) {
        let that = this;
        this.submitIsBusy = true;
        let credentials = { "email": email, "password": password };
        try {
            await this.session.authenticate('authenticator:jwt', credentials);
        } catch (error) {
            let modalType = { "name": "type", "value": "error" };
            if (error.status === 401) {
                // if the request fails due to wrong credentials, notify the user
                let modalTitle = { "name": "title", "value": "modal/wrong-credentials/title" };
                let modalText = { "name": "text", "value": ["modal/wrong-credentials/text-01"] };
                let yesLabel = { "name": "noLabel", "value": "Misc_Ok" };
                let noLabel = { "name": "yesLabel", "value": "modal/wrong-credentials/text-02" };
                let yesListener = {
                    "event": "click", "id": "modal-button-footer-yes", "function": function () {
                        that.manager.hideModal();
                    }
                };
                let noListener = {
                    "event": "click", "id": "modal-button-footer-no", "function": function () {
                        that.manager.hideModal();
                    }
                };
                this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
            } else {
                // if the request fails without receiving a response, ask the user to try again later
                let modalTitle = { "name": "title", "value": "Misc_Sorry" };
                let modalText = { "name": "text", "value": ["modal/sign-in-error/text-01"] };
                let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
                let yesListener = {
                    "event": "click", "id": "modal-button-footer-yes", "function": function () {
                        that.manager.hideModal();
                    }
                };
                this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
            }
        }
        this.submitIsBusy = false;
        if (this.session.isAuthenticated) {
            this.manager.log("Signed in successfully with email '" + this.session.data.authenticated.email + "'.");
            if (this.manager.router.currentRouteName === "sign-in") {
                // if the user is on the sign-in route, redirect to home
                this.manager.goToRoute("home");
            } else {
                // else close the modal
                this.manager.hideModal();
            }
        }
    }

    @action callForgotPasswordModal() {
        let that = this;
        let changeset = new Changeset({ "input": "" });
        let params = [
            { "name": "title", "value": "modal/forgot-password/title" },
            { "name": "text", "value": ["modal/forgot-password/text-01"] },
            { "name": "changeset", "value": changeset },
            { "name": "inputPlaceholder", "value": "component/sign-in/email-placeholder" },
            { "name": "inputType", "value": "email" },
            { "name": "inputPattern", "value": this.manager.pattern.email },
            { "name": "yesLabel", "value": "modal/forgot-password/submit" }
        ];
        let submitListener = {
            "event": "submit", "id": "modal-form", "function": function (event) {
                event.preventDefault();
                let email = changeset.get("input");
                fetch(ENV.APP.apiUrl + "/actions/send-password-reset-code?email=" + email);
                let confirmModalTitle = { "name": "title", "value": "modal/forgot-password-confirm/title" };
                let confirmModalText = { "name": "text", "value": ["modal/forgot-password-confirm/text-01"] };
                that.manager.callModal("confirm", [{ "name": "type", "value": "success" }, confirmModalTitle, confirmModalText]);
            }
        };
        this.manager.callModal("single-input", params, [submitListener]);
    }

    @action callRequestVerificationCodeModal() {
        let that = this;
        let changeset = new Changeset({ "input": "" });
        let params = [
            { "name": "title", "value": "modal/request-verification-code/title" },
            { "name": "text", "value": ["modal/request-verification-code/text-01"] },
            { "name": "changeset", "value": changeset },
            { "name": "inputPlaceholder", "value": "Component_SignIn_EmailPlaceholder" },
            { "name": "inputType", "value": "email" },
            { "name": "inputPattern", "value": this.manager.pattern.email },
            { "name": "yesLabel", "value": "modal/request-verification-code/yes-label" }
        ];
        let submitListener = {
            "event": "submit", "id": "modal-form", "function": function (event) {
                event.preventDefault();
                let email = changeset.get("input");
                fetch(ENV.APP.apiUrl + "/actions/send-verification-code?email=" + email);
                let confirmModalTitle = { "name": "title", "value": "modal/request-verification-code-confirm/title" };
                let confirmModalText = { "name": "text", "value": ["modal/request-verification-code-confirm/text-01"] };
                that.manager.callModal("confirm", [{ "name": "type", "value": "success" }, confirmModalTitle, confirmModalText]);
            }
        };
        this.manager.callModal("single-input", params, [submitListener]);
    }
}