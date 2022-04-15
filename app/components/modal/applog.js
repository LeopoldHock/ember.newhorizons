//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Modal::App-Log component.
//----------------------------------------------------------------------------//
import ModalComponent from './modal';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ModalApplogComponent extends ModalComponent {
    @service manager;
    @service store;
    @tracked applog = [];

    willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers before the modal is being rendered. Argument interpretation is
        // happening here. Calling super.willRender() is required.
        //----------------------------------------------------------------------------//
        super.willRender();
        this.applog = this.store.peekAll("applog");
    }

    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers after the modal has rendered. Event subscription is happening here.
        // Calling super.didRender() is required.
        //----------------------------------------------------------------------------//
        super.didRender();
    }
}