//----------------------------------------------------------------------------//
// Leopold Hock / 2021-04-05
// Description:
// Controller for template stellarpedia/article.
//----------------------------------------------------------------------------//
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaArticleController extends Controller {

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