import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import SecondaryAttribute from 'new-horizons/game/identifiables/sec-a';

export default class DatabaseSecAModel extends DatabasePrefabModel {
    @service database;

    @attr() current;
    @attr() bonus;
    @attr() primaryAttributes;
    @attr() div;

    addToCharacter(character, { update = true, isGenerator = true } = {}) {
        let secondaryAttribute = new SecondaryAttribute({ data: this.database.cloneRecord(this), context: this, isGenerator: isGenerator, character: character });
        character.getSecondaryAttributes().push(secondaryAttribute);
        if (update) {
            secondaryAttribute.update({ logSuccess: false });
        }
    }
}