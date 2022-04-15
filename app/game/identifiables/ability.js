//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-14
// Description:
// This is the instance representation of an ability. For the model, see
// models/identifiables/ability.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { inject as service } from '@ember/service';
import MessageService from "new-horizons/services/message-service";

export default class PrimaryAttribute extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    /**
     * Adds the ability to the given character.
     * @param  {Object} character - The character.
     * @param  {bool} logSuccess=true (optional) - Whether success should be logged.
     * @param  {bool} allowRemove=true (optional) - Should removing the ability during the same session be allowed?
     * @returns  {Object} - Returns the ability or undefined.
     */
    add(character, { logSuccess = true, allowRemove = true } = {}) {

    }

    /**
     * Removes the ability from the character.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     * @returns  {bool} - Returns true or undefined.
     */
    remove({ logSuccess = true } = {}) {
        this.character.getAbilities().removeObject(this);
        if (logSuccess) {
            this.manager.log(`Ability '${this.id}' has been removed from character '${this.character.name}'.`, MessageService.messageType.information);
        }
        return true;
    }

    /**
     * Applies the ability's costs to the character.
     * @param {*} character - The character.
     * @param {Boolean} useGp=false (optional) - If set to true, costs will be converted to GP insted of EP.
     * @param {bool} logSuccess=true (optional) - Should success be logged?
     */
    applyCosts(character, { useGp = false, logSuccess = true } = {}) {

    }
}