//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-20
// Description:
// Controller for route Sign-Up. This is where users sign up new accounts.
//----------------------------------------------------------------------------//

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import ENV from 'new-horizons/config/environment';

export default class SignUpController extends Controller {
    @service manager;
    @tracked data = {};
    @tracked changeset = Changeset(this.data);
    @tracked passwordEventListeners = [{ event: "input", function: this.onPasswordChange }, { event: "invalid", function: this.onPasswordInvalid }];
    @tracked submitIsBusy = false;

    @tracked title = "";

    @action onSubmit(event) {
        event.preventDefault();
        let form = event.srcElement;
        if (form.checkValidity()) {
            let data = {
                "type": "users",
                "attributes": {
                    email: this.changeset.get("email"),
                    username: this.changeset.get("username"),
                    password: this.changeset.get("passwordRaw")
                }
            };
            this.signUp(data);
        }
    }

    @action signUp(data) {
        // send the sign-up request
        let that = this;
        this.submitIsBusy = true;
        fetch(ENV.APP.apiUrl + "/" + ENV.APP.apiNamespace + "/users", {
            method: 'POST',
            headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" },
            body: JSON.stringify({ "data": data })
        }).then(function (response) {
            that.submitIsBusy = false;
            // by default, prepare an error message and ask the user to try again later
            let modalType = { "name": "type", "value": "error" };
            let modalTitle = { "name": "title", "value": "Misc_Sorry" };
            let modalText = { "name": "text", "value": ["modal/sign-up-error/text-01"] };
            let yesLabel = { "name": "yesLabel", "value": "Misc_Ok" };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                }
            };
            if (response.status === 201) {
                // on success, notify the user and ask them to confirm their email
                modalType = { "name": "type", "value": "success" };
                modalTitle = { "name": "title", "value": "modal/sign-up-success/title" };
                modalText = { "name": "text", "value": ["modal/sign-up-success/text-01"] };
                yesListener = {
                    "event": "click", "id": "modal-button-footer-yes", "function": function () {
                        that.manager.goToRoute("home");
                        that.manager.hideModal();
                    }
                };
            } else if (response.status === 422) {
                modalTitle = { "name": "title", "value": "modal/sign-up-duplicate/title" };
                modalText = { "name": "text", "value": ["modal/sign-up-duplicate/text-01"] };
            }
            that.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
        }).catch(function () {
            that.submitIsBusy = false;
            // if the request fails without receiving a response, ask the user to try again later
            let modalType = { "name": "type", "value": "error" };
            let modalTitle = { "name": "title", "value": "Misc_Sorry" };
            let modalText = { "name": "text", "value": ["modal/sign-up-error/text-01"] };
            let yesLabel = { "name": "yesLabel", "value": "Misc_Ok" };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                }
            };
            that.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
        });
    }

    @action onPasswordChange(event) {
        let password = event.srcElement.value;
        let complexity = 0;
        let length = password.length;
        let variety = 0;
        if (password.match(/[a-z]/)) variety++; // does the password have lowercase letters?
        if (password.match(/[A-Z]/)) variety++; // does the password have uppercase letters?
        if (password.match(/\d/)) variety++; // does the password have digits?
        if (password.match(/[!@#$%&*()-+=^]/)) variety++; // does the password have special characters?
        if (length >= 21 && variety > 2) complexity = 4;
        else if (length >= 11 && length <= 20 && variety > 2) complexity = 3;
        else if ((length >= 10) && variety === 2) complexity = 2;
        else complexity = 1;
        switch (complexity) {
            case 0: // no or invalid password
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 1: // 8-12 characters, contains only one of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderError)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 2: // 13-18 characters, contains two of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderWarning)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderWarning)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 3: // 19-25 characters, contains all of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 4: // 25-40 characters, contains all of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                break;
        }
    }

    @action onPasswordInvalid() {
        document.getElementById("password-requirements-text").classList.remove("display-none");
    }
}