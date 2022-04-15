import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import MessageService from 'new-horizons/services/message-service';

export default class DatabaseAbilityModel extends DatabasePrefabModel {
    @service manager;
    @service database;
    @service generator;
    @service editor;

    @attr() abilityCategory;
    @attr() editorOnly;
    @attr() requirements;
    @attr() needsInput;
    @attr() input;
    @attr() isSpecialisation;
    @attr() options;
    @attr() isActive;
    @attr() castTime;
    @attr() staminaUse;
    @attr() usesPower;
    @attr() powerUse;
    @attr() costs;
    @attr() targets;

    /**
     * Adds an ability to the given character.
     * @param  {bool} input (optional) - The input of the ability.
     * @param  {bool} logSuccess=true (optional) - Whether success should be logged.
     */
    addToCharacter(character, { input, logSuccess = true } = {}) {
        let newAbility = this.database.getIdentifiable(this.id, { clone: true });
        if (character.getAbility(this.id, { input: input })) {
            this.manager.log(`Unable to add ability '${this.id}' with input '${input}' to character '${character.name}': Character already has that ability`, MessageService.messageType.exception);
            return undefined;
        }
        if (input) {
            newAbility.input = input;
        }
        character.data.abilities.pushObject(newAbility);
        if (logSuccess) this.manager.log(`Ability '${newAbility.id}' with input '${newAbility.input}' has been added to character '${character.name}'.`, MessageService.messageType.information);
    }
}