//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Modal::Bug-Report component.
//----------------------------------------------------------------------------//
import ModalComponent from './modal';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class ModalBugReportComponent extends ModalComponent {
    @service manager;
    @service store;
    @tracked data = { error: "", description: "", reproduction: "", email: "", stack: "", includeLog: true };
    @tracked changeset = Changeset(this.data);

    willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers before the modal is being rendered. Argument interpretation is
        // happening here. Calling super.willRender() is required.
        //----------------------------------------------------------------------------//
        super.willRender();
    }

    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers after the modal has rendered. Event subscription is happening here.
        // Calling super.didRender() is required.
        //----------------------------------------------------------------------------//
        super.didRender();
        // if session is authentiacted, prefill the mail adress
        // if (this.manager.session.authenticated) {
        //     this.data.email = session.authenticated.data.user.email;
        // }
    }

    @action onSubmit() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Triggers when the form is submitted.
        //----------------------------------------------------------------------------//
        let form = document.getElementById("modal-form");
        if (form.reportValidity()) {
            this.changeset.save();
            let logAsJson = "";
            if (this.data.includeLog) logAsJson = this.manager.messageService.getApplog(100, true);
            let post = this.store.createRecord("bug-report", {
                description: this.data.description,
                reproduction: this.data.reproduction,
                applog: logAsJson,
                email: this.data.email,
            });
            post.save();
            this.manager.hideModal();
            // show success modal
            let that = this;
            let modalType = { "name": "type", "value": "success" };
            let modalTitle = { "name": "title", "value": "modal/report-bug-success/title" };
            let modalText = { "name": "text", "value": ["modal/report-bug-success/text-01"] };
            let yesLabel = { "name": "yesLabel", "value": "modal/report-bug-success/yes-label" };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                }
            };
            this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
        }
    }
}