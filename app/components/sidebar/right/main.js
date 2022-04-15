import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class SidebarRightMainComponent extends Component {
    @service manager;
    @service session;

    @action callSignOutModal() {
        let modalTitle = { "name": "title", "value": "modal/sign-out/title" };
        let modalText = { "name": "text", "value": ["modal/sign-out/text-01"] };
        let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
        let noLabel = { "name": "noLabel", "value": "Misc_No" };
        let that = this;
        let yesListener = {
            "event": "click", "id": "modal-button-footer-yes", "function": async function () {
                that.manager.hideModal();
                await that.session.invalidate("authenticator:jwt");
            }
        };
        let noListener = {
            "event": "click", "id": "modal-button-footer-no", "function": function () {
                that.manager.hideModal();
            }
        };
        this.manager.callModal("confirm", [undefined, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
    }
}