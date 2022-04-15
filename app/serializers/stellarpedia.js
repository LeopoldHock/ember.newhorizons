import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';

export default class StellarpediaSerializer extends JSONSerializer {
    @service database;

    // transform book ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = this.database.transformId(id);
        return id;
    }

    // also transform chapter and entry ids
    normalize(typeClass, hash) {
        for (let chapter of hash.chapters) {
            chapter.id = this.database.transformId(chapter.id);
            for (let entry of chapter.entries) {
                entry.id = this.database.transformId(entry.id);
                // add full path to entry
                entry.path = `${this.database.transformId(hash.id)}+${chapter.id}+${entry.id}`;
            }
        }
        return super.normalize(typeClass, hash);
    }
}