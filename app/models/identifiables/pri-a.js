import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import PrimaryAttribute from 'new-horizons/game/identifiables/pri-a';

export default class DatabasePriAModel extends DatabasePrefabModel {
    @service database;

    @attr() current;
    @attr() start;
    @attr() min;
    @attr() max;

    addToCharacter(character, { isGenerator = true } = {}) {
        let primaryAttribute = new PrimaryAttribute({ data: this.database.cloneRecord(this), context: this, isGenerator: isGenerator, character: character });
        character.getPrimaryAttributes().push(primaryAttribute);
    }
}