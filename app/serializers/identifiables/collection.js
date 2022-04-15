import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';

export default class DatabaseCollectionSerializer extends JSONSerializer {
    @service database;

    // dasherize model ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = dasherize(id);
        return id;
    }

    // transform ids in all arrays
    normalize(typeClass, hash) {
        let transformedId = this.database.transformId(hash.id);
        hash.id = transformedId;
        return super.normalize(typeClass, hash);
    }
}