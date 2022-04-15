import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';

export default class DatabaseSerializer extends JSONSerializer {
    @service database;

    // dasherize model ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = dasherize(id);
        return id;
    }

    // transform ids in all arrays
    normalize(typeClass, hash) {
        for (let entry of hash.entries) {
            entry.id = this.database.transformId(entry.id);
        }
        return super.normalize(typeClass, hash);
    }
}