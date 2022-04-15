import CustomObject from "new-horizons/game/custom-object";
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default class Identifiable extends CustomObject {
    @service manager;
    @service database;
    keys = [];
    isRemovable = false;

    constructor({ data, character, context, isGenerator = false } = {}) {
        super({ context: context });
        if (!data) {
            throw "Instantiation of identifiable failed because no data was supplied.";
        }
        if (character) {
            set(this, "character", character);
        }
        set(this, "keys", Object.keys(data));
        set(this, "isGenerator", isGenerator);
        for (let key of this.keys) {
            set(this, key, data[key]);
        }
    }

    getPure() {
        let result = {};
        for (let key of this.keys) {
            result[key] = this[key];
        }
        return result;
    }

    serialize() {
        return JSON.stringify(this.getPure());
    }

    getCharacter() {
        return this.character;
    }
}