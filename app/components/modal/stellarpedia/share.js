import ModalComponent from '../modal';
import { inject as service } from '@ember/service';
import { Changeset } from 'validated-changeset';
import { action } from '@ember/object';

export default class ModalStellarpediaShareComponent extends ModalComponent {
    @service manager;
    @service messageService;
    @service modalService;

    data = { url: window.location.href };
    changeset = new Changeset(this.data);

    @action onCopy() {
        this.modalService.hide();
        let that = this;
        navigator.clipboard.writeText(this.data.url).then(function () {
            that.messageService.showNotification(that.manager.localize("modal/stellarpedia/share/link-copied"));
        });

    }
}