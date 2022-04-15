import RESTAdapter from '@ember-data/adapter/rest';

export default class CollectionAdapter extends RESTAdapter {
    namespace = "/assets/";

    urlForFindAll(modelName) {
        return this.namespace + modelName + ".json";
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll() {
        return false;
    }

    // Prevent Create and Update
    updateRecord(store, type, snapshot) {
        return snapshot;
    }

    createRecord(store, type, snapshot) {
        return snapshot;
    }
}