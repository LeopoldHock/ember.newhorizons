import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import ENV from 'new-horizons/config/environment';

export default class RequestResetPasswordController extends Controller {
    @service manager;
    @tracked changeset = Changeset({ passwordRaw: "" });
    @tracked passwordEventListeners = [{ event: "input", function: this.onPasswordChange }, { event: "invalid", function: this.onPasswordInvalid }];
    @tracked submitIsBusy = false;

    @action onSubmit(event) {
        event.preventDefault();
        let form = event.srcElement;
        if (form.checkValidity()) {
            // send a request to update the password
            let that = this;
            let data = {
                "type": "password-resets",
                "id": this.model.resetPasswordCode.value,
                "attributes": {
                    new_password: this.changeset.get("passwordRaw")
                }
            };
            this.submitIsBusy = true;
            fetch(ENV.APP.apiUrl + "/" + ENV.APP.apiNamespace + "/password-resets/" + this.model.resetPasswordCode.value, {
                method: 'PATCH',
                headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" },
                body: JSON.stringify({ "data": data })
            }).then(
                function (response) {
                    that.submitIsBusy = false;
                    if (response.status === 200) {
                        // if the request succeeded, show success modal and redirect to sign in
                        that.manager.goToRoute("sign-in");
                        let params = [
                            { "name": "type", "value": "success" },
                            { "name": "title", "value": "modal/rest-password-success/title" },
                            { "name": "text", "value": ["modal/rest-password-success/text-01"] },
                            { "name": "yesLabel", "value": "Misc_Ok" }
                        ];
                        that.manager.callModal("confirm", params);
                    } else {
                        // if the request failed, show error modal
                        let params = [
                            { "name": "type", "value": "error" },
                            { "name": "title", "value": "modal/rest-password-error/title" },
                            { "name": "text", "value": ["modal/rest-password-error/text-01"] },
                            { "name": "yesLabel", "value": "Misc_Ok" }
                        ];
                        that.manager.callModal("confirm", params);
                    }
                }
            );
        }
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
