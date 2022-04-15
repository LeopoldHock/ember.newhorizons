//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-14
// Description:
// This is the instance representation of a skill. For the model, see
// models/identifiables/skill.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import MessageService from "new-horizons/services/message-service";

export default class Skill extends Identifiable {
    @service manager;
    @service database;
    @service generator;
    @service store;

    /**
     * Adds the skill to the given character.
     * @param  {Object} character - The character.
     * @param  {bool} logSuccess=true (optional) - Whether success should be logged.
     * @param  {bool} updateSkill=true (optional) - Whether the skill should be updated afterwards.
     * @param  {bool} allowRemove=true (optional) - Should removing the skill during the same session be allowed?
     * @returns  {Object} - Returns the skill or undefined.
     */
    add(character, { logSuccess = true, updateSkill = true, allowRemove = true } = {}) {
        let skill = this;
        if (character.getSkill(this.id)) {
            this.manager.log(`Unable to add skill '${this.id}' to character '${character.name}': Character already has that skill.`, MessageService.messageType.exception);
            return undefined;
        } else {
            this.isRemovable = allowRemove;
            character.data.skills.pushObject(this);
            set(this, "character", character);
            if (logSuccess) {
                this.manager.log(`Skill '${this.id}' has been added to character '${character.name}'.`, MessageService.messageType.information);
            }
        }
        if (updateSkill) {
            skill.update({ logSuccess: false });
        }
        return skill;
    }

    /**
     * Removes the skill from the character.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     * @returns  {bool} - Returns true or undefined.
     */
    remove({ logSuccess = true } = {}) {
        this.character.getSkills().removeObject(this);
        if (logSuccess) {
            this.manager.log(`Skill '${this.id}' has been removed from character '${this.character.name}'.`, MessageService.messageType.information);
        }
        return true;
    }

    /**
     * Updates the skill.
     * @param  {bool} updateMinimum=true (optional) - Should the minimum level be set to the current level?
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     * @returns  {Object} - Returns the skill or undefined.
     */
    update({ updateMinimum = true, logSuccess = true } = {}) {
        let highestPriA;
        for (let priAId of this.primaryAttributes) {
            let priA = this.character.getPrimaryAttribute(priAId);
            if (!highestPriA || priA.current > highestPriA.current) {
                highestPriA = priA;
            }
        }
        if (!highestPriA) {
            this.manager.log(`Unable to update skill '${this.id}' for character '${this.character.name}': None of the primary attributes could be found.`, MessageService.messageType.exception);
            return undefined;
        }
        let maxAllowedDiff = this.database.getIdentifiable("constant/skills-pri-a-max-diff").value;
        let newMax = highestPriA.current + maxAllowedDiff;
        this.setProperty("max", newMax, { override: true, logSuccess: logSuccess });
        if (updateMinimum) {
            this.setProperty("min", this.current, { override: true, logSuccess: logSuccess });
        }
        return this;
    }

    /**
     * Sets the level.
     * @param  {number} value - The value. Can be used for increasing/decreasing or overriding the current level.
     * @param  {bool} override=false (optional) - Whether value should be increased/decreased or overriden.
     * @param  {bool} validate=true (optional) - Should the target level be checked against min/max?
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     * @returns  {Object} - Returns the skill or undefined.
     */
    setLevel(value, { override = false, validate = true, logSuccess = true } = {}) {
        let oldValue = this.current;
        let newValue = this.current;
        if (override) {
            newValue = value;
        } else {
            newValue += value;
        }
        // check against max
        if (newValue > this.max && validate) {
            this.manager.log(`Unable to change level of skill '${this.id}' for character '${this.character.name}': New value ${newValue} would exceed maximum value ${this.max}.`, MessageService.messageType.warning);
            return undefined;
        } else if (newValue < this.min && validate) {
            this.manager.log(`Unable to change level of skill '${this.id}' for character '${this.character.name}': New value ${newValue} would subceed minimum value ${this.min}.`, MessageService.messageType.warning);
            return undefined;
        }
        set(this, "current", newValue);
        if (logSuccess) {
            this.manager.log(`Level of skill '${this.id}' for character '${this.character.name}' has been changed from ${oldValue} to ${this.current}.`, MessageService.messageType.information);
        }
        return this;
    }

    /**
     * Sets a property.
     * @param  {string} property - The property to change.
     * @param  {number} value - The new value. Can be used to increase/decrease or override.
     * @param  {bool} override=false (optional) - Whether value should be increased/decreased or overriden.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     * @returns  {Object} - Returns the skill or undefined.
     */
    setProperty(property, value, { override = false, logSuccess = true } = {}) {
        if (this[property] !== undefined) {
            let oldValue = this[property];
            if (override) {
                set(this, property, value);
            } else {
                set(this, property, this[property] + value);
            }
            if (logSuccess) {
                this.manager.log(`Value '${property}' of skill '${this.id}' for character '${this.character.name}' has been changed from ${oldValue} to ${this[property]}.`, MessageService.messageType.information);
            }
            return this;
        } else {
            this.manager.log(`Unable to change value '${property}' of skill '${this.id}' for character '${this.character.name}': Property not found`, MessageService.messageType.exception);
            return undefined;
        }
    }

    get hideRemoveButton() {
        if (this.isBasic) {
            return true;
        } else if (this.isRemovable) {
            return false;
        } else {
            return false;
        }
    }

    get disableRemoveButton() {
        if (this.current > 0) {
            return true;
        } else {
            return false;
        }
    }
}