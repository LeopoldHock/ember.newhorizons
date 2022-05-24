//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-21
// Description:
// Controller for component interactable::button.
//----------------------------------------------------------------------------//
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import MessageService from 'new-horizons/services/message-service';

export default class DropdownComponent extends Component {
    @service manager;
    @service stellarpedia;

    @action handleClick() {
        let articleId = this.manager.database.transformId(this.article);
        let split = articleId.split("/");
        if (!Array.isArray(split) || split.length < 3) {
            this.manager.log("Invalid Stellarpedia path: " + articleId, MessageService.messageType.exception);
        } else {
            let entryId;
            if (split.length === 3) {
                entryId = split[2];
            } else {
                entryId = "";
                for (let i = 2; i < split.length; i++) {
                    entryId = entryId + split[i];
                    if (i < split.length - 1) {
                        entryId = entryId + "/";
                    }
                }
            }
            this.manager.showStellarpediaEntry(split[0], split[1], entryId, { updateScrollPosition: true });
        }
    }
}