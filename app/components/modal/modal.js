//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Parent controller for all modal components to inherit from. Has
// universal logic to be triggered before rendering, like event subcription
// and argument interpretation.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import MessageService from 'new-horizons/services/message-service';
import classic from 'ember-classic-decorator';

@classic
export default class ModalComponent extends Component {
    @service manager;
    @service modalService;
    @tracked type = "default";

    willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers before he modal is being rendered. Argument interpretation is
        // happening here.
        //----------------------------------------------------------------------------//
        super.willRender();
        // Argument interpretation
        for (let argument of this.modalService.args) {
            // skip undefined parameters to allow defaults
            if (argument === undefined) continue;
            if (typeof argument.name !== "undefined" && typeof argument.value !== "undefined") {
                this.set(argument.name, argument.value);
            } else {
                this.manager.log("Unable to process modal argument: " + JSON.stringify(argument), MessageService.messageType.warning);
            }
        }
    }

    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers after the modal has rendered. Event subscription is happening here.
        //----------------------------------------------------------------------------//
        super.didRender();
        // Event subscription
        for (let listener of this.modalService.listeners) {
            try {
                document.getElementById(listener.id).addEventListener(listener.event, listener.function);
            } catch (exception) {
                this.manager.log("Unable to process modal event listener: " + JSON.stringify(listener) + " (" + exception + ")", MessageService.messageType.warning);
            }
        }
    }
}