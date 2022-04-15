import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class StellarpediaAdapter extends RESTAdapter {
    @service localization;
    namespace = "/assets/stellarpedia/stellarpedia_";

    urlForFindAll() {
        let url = this.namespace + this.localization.getCurrentLocale() + ".json";
        return url;
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll() {
        return false;
    }
}