//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-13
// Description:
// This is the instance representation of a trait. For the model, see
// models/identifiables/trait.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import MessageService from "new-horizons/services/message-service";

export default class Trait extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    hideRemoveButton = false;

    /**
     * Removes the trait
     * @param  {bool} undoChanges=true (optional) - Whether changes should be undone.
     * @param  {bool} logSuccess=true (optional) - Whether success should bee logged.
     */
    remove({ undoChanges = true, logSuccess = true } = {}) {
        if (undoChanges) {
            if (this.hasLevel) {
                for (let i = 1; i <= this.level; i++) {
                    this.undoChanges({ logSuccess: logSuccess });
                }
            } else {
                this.undoChanges({ logSuccess: logSuccess });
            }

        }
        this.character.data.traits.removeObject(this);
        return true;
    }

    /**
     * Applies changes to other values.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    applyChanges({ logSuccess = true } = {}) {
        if (this.targets?.length > 0) {
            this.character.applyChanges(this.targets, { isGenerator: this.isGenerator, logSuccess: logSuccess });
        }
        if (this.hasOptions && this.selectedOption.targets?.length > 0) {
            this.character.applyChanges(this.selectedOption.targets, { isGenerator: this.isGenerator, logSuccess: logSuccess });
        }
    }

    /**
     * Undoes changes to other values.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    undoChanges({ logSuccess = true } = {}) {
        if (this.targets?.length > 0) {
            this.character.undoChanges(this.targets, { isGenerator: this.isGenerator, logSuccess: logSuccess });
        }
        if (this.hasOptions && this.selectedOption.targets?.length > 0) {
            this.character.undoChanges(this.selectedOption.targets, { isGenerator: this.isGenerator, logSuccess: logSuccess });
        }
    }

    /**
     * Changes the trait's level by the specified value
     * @param  {} value - Can be any positige and negative integer.
     * @param  {} validate=true (optional) - Will check the target value against min and max.
     * @param  {} applyChanges=true (optional) - Should changes be applied?
     * @param  {} logSuccess=true (optional) - Should success be logged?
     */
    setLevel(value, { validate = true, applyChanges = true, logSuccess = true } = {}) {
        let targetLevel = this.level + value;
        if (validate && targetLevel < this.minLevel) {
            this.manager.log(`Cannot change level of trait '${this.id}}' for character '${this.character.name}' by ${value}: Target level would be lower than the minimum level.`, MessageService.messageType.exception);
            return undefined;
        } else if (validate && targetLevel > this.maxLevel) {
            this.manager.log(`Cannot change level of trait '${this.id}}' for character '${this.character.name}' by ${value}: Target level would be higher than the maximum level.`, MessageService.messageType.exception);
            return undefined;
        }
        if (value < 0) {
            let abs = Math.abs(value);
            for (let i = 1; i <= abs; i++) {
                this._decrementLevel({ applyChanges: applyChanges, logSuccess: logSuccess });
            }
        } else {
            for (let i = 1; i <= value; i++) {
                this._incrementLevel({ applyChanges: applyChanges, logSuccess: logSuccess });
            }
        }
        return this;
    }

    _incrementLevel({ applyChanges = true, logSuccess = true } = {}) {
        let oldLevel = this.level;
        set(this, "level", this.level + 1);
        if (logSuccess) {
            this.manager.log(`Level of trait '${this.id}}' for character '${this.character.name}' has changed from ${oldLevel} to ${this.level}.`);
        }
        if (applyChanges) {
            this.applyChanges({ logSuccess: logSuccess });
        }
    }

    _decrementLevel({ applyChanges = true, logSuccess = true } = {}) {
        let oldLevel = this.level;
        set(this, "level", this.level - 1);
        if (logSuccess) {
            this.manager.log(`Level of trait '${this.id}}' for character ${this.character.name} has changed from ${oldLevel} to ${this.level}.`);
        }
        if (applyChanges) {
            this.undoChanges({ logSuccess: logSuccess });
        }
    }
}