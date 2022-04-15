//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// Controller for template stellarpedia.
//----------------------------------------------------------------------------//
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaController extends Controller {
    @service manager;
    @service stellarpedia;
    @service manager;

    @action onShare() {
        this.manager.callModal("stellarpedia/share");
    }

    @action onSearch() {
        this.manager.callModal("stellarpedia/search");
    }
}