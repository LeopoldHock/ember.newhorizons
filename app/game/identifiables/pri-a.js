//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-14
// Description:
// This is the instance representation of a primary attribute. For the model, see
// models/identifiables/pri-a.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import MessageService from "new-horizons/services/message-service";

export default class PrimaryAttribute extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    /**
     * Sets the primary attribute's level.
     * @param  {number} value - The level value. Can be used for addition, substraction or replace the previous value.
     * @param  {bool} override=false - Whether the old level value should be overriden.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} validate=true - Whether skill level should be checked against minimum and maximum value.
     * @param  {bool} updateDependencies=true - Whether dependencies should be updated.
     * @returns  {Object} - Returns the primary attribute or undefined.
     */
    setLevel(value, { override = false, logSuccess = true, validate = true, updateDependencies = true } = {}) {
        let oldValue = this.current;
        let newValue = this.current;
        if (override) {
            newValue = value;
        } else {
            newValue += value;
        }
        if (validate) {
            if (newValue > this.max) {
                this.manager.log(`Unable to change level of primary attribute '${this.id}' for character '${this.character.name}': New value ${newValue} would exceed maximum value ${this.max}.`, MessageService.messageType.warning);
                return undefined;
            } else if (newValue < this.min) {
                this.manager.log(`Unable to change level of primary attribute '${this.id}' for character '${this.character.name}': New value ${newValue} would subceed minimum value ${this.min}.`, MessageService.messageType.warning);
                return undefined;
            }
        }
        set(this, "current", newValue);
        if (logSuccess) this.manager.log(`Level of primary attribute '${this.id}' for character '${this.character.name}' has been changed from ${oldValue} to ${this.current} (updating dependencies: ${updateDependencies}).`, MessageService.messageType.information);
        if (updateDependencies) {
            this.updateDependencies();
        }
        return this;
    }

    /**
     * Sets any one of the primary attribute's properties.
     * @param  {string} property - The property's name.
     * @param  {number} value - The new value. Can be used for addition, substraction or replace the previous value.
     * @param  {bool} override=false - Whether the old value should be replaced.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} updateCurrent=true - Whether success should be logged.
     * @returns {object} - Returns the updated primary attribute or undefined.
     */
    setProperty(property, value, { override = false, logSuccess = true, updateCurrent = true } = {}) {
        if (this[property] === undefined) {
            this.manager.log(`Unable to change '${property}' of primary attribute '${this.id}' for character '${this.character.name}': Property not found.`, MessageService.messageType.exception);
            return undefined;
        }
        let oldValue = this[property];
        if (override) {
            set(this, property, value);
        } else {
            set(this, property, this[property] + value);
        }
        // Update current value if required
        if (updateCurrent) {
            if (property === "min" && this.current < this.min) {
                this.setLevel(this.min, { override: true });
            } else if (property === "max" && this.current > this.max) {
                this.setLevel(this.max, { override: true });
            }

        }
        if (logSuccess) this.manager.log(`'${property}' of primary attribute '${this.id}' for character '${this.character.name}' has changed from ${oldValue} to ${this[property]}.`);
        return this;
    }

    /**
     * Updates the primary attribute's dependencies.
     * @param  {bool} logSuccess=false (optional) - Should success be logged?
     */
    updateDependencies({ logSuccess = false } = {}) {
        // update secondary attributes
        for (let secA of this.character.getSecondaryAttributes()) {
            for (let priA of secA.primaryAttributes) {
                if (this.database.transformId(priA) === this.id) {
                    secA.update({ logSuccess: logSuccess });
                    break;
                }
            }
        }
        // update skills
        for (let skill of this.character.getSkills()) {
            for (let priAId of skill.primaryAttributes) {
                if (this.database.transformId(priAId) === this.id) {
                    skill.update({ logSuccess: logSuccess, updateMinimum: false });
                    break;
                }
            }
        }
    }
}