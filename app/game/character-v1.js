//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// Character Class Version 1.
//----------------------------------------------------------------------------//
import CustomObject from 'new-horizons/game/custom-object';
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import MessageService from 'new-horizons/services/message-service';

export default class CharacterV1 extends CustomObject {
    @service manager;
    @service generator;
    @service editor;
    @service database;

    // @tracked data = ({
    data = tracked({
        //----------------------------------------------------------------------------//
        // General stuff
        gameVersion: "", // The game version with that the character has been used last.
        generatorPreset: "", // The id of the character preset the character has been created with.
        characterPreset: "",

        //----------------------------------------------------------------------------//
        // General stuff
        general: {
            name: "", // The character's full name.
            sex: "", // The character's sex/gender.
            age: "", // The character's age.
            birthday: "", // The character's birthday.
            height: "", // The character's height.
            weight: "", // The character's weight.
            appearance: "", // The character's general apperance.
            family: "", // Some information about the character's family or heritage.
            origin: "", // The character's origin.
            socialStatus: 1, // The character's general social status.
        },

        //----------------------------------------------------------------------------//
        // Status and Experience
        status: {
            currentConstraint: 0,
            fpAvailable: 0,
            epTotal: 0,
            epAvailable: 0,
        },

        //----------------------------------------------------------------------------//
        // Collections
        primaryAttributes: [],
        secondaryAttributes: [],
        traits: [],
        skills: [],
        abilities: [],
        specialisations: [],
        apps: [],

        //----------------------------------------------------------------------------//
        // Inventory
        inventory: {
            items: [],
            weight: 0,
            credits: 0
        }
    });

    /**
     * Represents a character that can kept during the session and exported to JSON.
     * @param  {string} characterPresetId
     * @param  {string} version
     * @param  {Object} context
     */
    constructor(characterPresetId, version, { context } = {}) {
        super({ context: context });
        // Set the character preset and game version
        this.data.characterPreset = characterPresetId;
        this.data.gameVersion = version;
        // Log initialization
        this.manager.log(`Character initialization complete (character preset: ${characterPresetId}, game version: ${version}).`);
    }

    /**
     * Gets the character's name or a placeholder if the name hasn't been set.
     * @returns  {string}
     */
    get name() {
        if (this.manager.isNullOrWhitespace(this.data.general.name)) {
            return 'Anonynmous';
        } else {
            return this.data.general.name;
        }
    }

    /**
     * Sets a general property.
     * @param  {string} property - The property key.
     * @param  {*} value - The new property value.
     * @param  {bool} override=true - Whether the new value should be overridden. 'false' only works on numbers.
     * @param  {bool} checkType=true - Whether the type of the new value should be checked against the old one.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} logOldValue=false - Whether the old value should be logged. Only works with 'logSuccess = true'.
     * @returns {*} - Returns the property value or undefined.
     */
    setGeneralProperty(property, value, { override = true, checkType = true, logSuccess = true, logOldValue = false } = {}) {
        if (this.data.general[property] !== undefined) {
            if (typeof this.data.general[property] !== typeof value && checkType) {
                this.manager.log(`Unable to change property '${property}' for character '${this.name}': Types don't match (got '${typeof value}', expected '${typeof this.data.general[property]}').`, MessageService.messageType.exception);
                return undefined;
            }
            let oldValue = this.data.general[property];
            if (!override && typeof value === "number" && typeof this.data.general[property] === "number") {
                let newValue = this.data.general[property] += value;
                set(this.data.general, property, newValue);
            } else {
                set(this.data.general, property, value);
            }
            if (logSuccess) {
                if (logOldValue) {
                    this.manager.log(`Property '${property}' for character '${this.name}' has been changed from '${oldValue}' to '${this.data.general[property]}'.`, MessageService.messageType.information);
                } else {
                    this.manager.log(`Property '${property}' for character '${this.name}' has been changed to '${this.data.general[property]}'.`, MessageService.messageType.information);
                }
            }
            return this.data.general[property];
        } else {
            this.manager.log(`Unable to change property '${property}' for character '${this.name}': Property not found.`, MessageService.messageType.exception);
            return undefined;
        }
    }

    /**
     * Gets a general property.
     * @param  {string} property - The propert key.
     * @returns {*} - Returns the property value or undefined.
     */
    getGeneralProperty(property) {
        return this.data.general[property];
    }

    /**
     * Recalculates and updates all properties.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} updateSkillMinima=true - Whether skill minima should be updated.
     */
    recalculate({ logSuccess = true, updateSkillMinima = true } = {}) {
        // update secondary attributes
        for (let secA of this.data.getSecondaryAttributes()) {
            this.updateSecondaryAttribute(secA.id, { logSuccess: logSuccess });
        }
        // update skills
        for (let skill of this.data.getSkills()) {
            skill.update({ logSuccess: logSuccess, updateMinimum: updateSkillMinima });
        }
    }

    /**
     * @returns  {Object[]} - Returns the character's primary attributes.
     */
    getPrimaryAttributes() {
        return this.data.primaryAttributes;
    }

    getPrimaryAttribute(id) {
        id = this.database.transformId(id);
        for (let priA of this.getPrimaryAttributes()) {
            if (priA.id === id) {
                return priA;
            }
        }
        return undefined;
    }

    getPrimaryAttributeProperty(id, property) {
        let priA = this.getPrimaryAttribute(id);
        if (priA) {
            return priA[property];
        } else {
            return undefined;
        }
    }

    /**
     * @returns  {Object[]} - Returns the character's secondary attributes.
     */
    getSecondaryAttributes() {
        return this.data.secondaryAttributes;
    }

    getSecondaryAttribute(id) {
        id = this.database.transformId(id);
        for (let secA of this.getSecondaryAttributes()) {
            if (secA.id === id) {
                return secA;
            }
        }
        return undefined;
    }

    getSecondaryAttributeProperty(id, property) {
        let secA = this.getSecondaryAttribute(id);
        return secA[property];
    }

    getSecondaryAttributeCurrent(id, { includeBonus = true } = {}) {
        let secA = this.getSecondaryAttribute(id);
        if (!secA) {
            this.manager.log(`Unable to get value of secondary attribute '${id}' for character '${this.name}': Secondary Attribute not found.`, MessageService.messageType.exception);
            return undefined;
        }
        let result = secA.current;
        if (includeBonus) {
            result += secA.bonus;
        }
        if (result < 1) result = 1;
        return result;
    }

    /**
     * @returns  {Object[]} - Returns the character's traits.
     */
    getTraits() {
        return this.data.traits;
    }

    /**
     * Returns a trait via the given id and, optionally, input or selectedOption.
     * @param  {} id - The trait's id.
     * @param  {} input (optional) - The triat's input.
     * @param  {} selectedOptionId (optional) - The trait's selected option.
     * @return  {Object} - Returns the trait or undefined.
     */
    getTrait(id, { input, selectedOptionId } = {}) {
        id = this.database.transformId(id);
        for (let trait of this.getTraits()) {
            if (trait.id === id) {
                if (trait.needsInput) {
                    if (trait.input === input) return trait;
                } else if (trait.hasOptions) {
                    if (selectedOptionId === trait.selectedOption.id) return trait;
                } else {
                    return trait;
                }
            }
        }
    }

    /**
     * @returns {Object[]} - Returns all of the character's skills.
     */
    getSkills() {
        return this.data.skills;
    }

    /**
     * Gets a skill via the given id.
     * @param  {string} id - The id of the skill.
     * @returns  {Object} - Returns the skill or undefined.
     */
    getSkill(id) {
        id = this.database.transformId(id);
        for (let skill of this.getSkills()) {
            if (skill.id === id) {
                return skill;
            }
        }
        return undefined;
    }

    /**
     * Gets a skill via the given id and returns its current level.
     * @param  {string} id - The id of the skill.
     * @returns  {number} - Returns the skill's level or undefined.
     */
    getSkillLevel(id) {
        let skill = this.getSkill(id);
        return skill?.current;
    }

    /**
     * @returns  {Object[]} - Returns the character's abilities.
     */
    getAbilities() {
        return this.data.abilities;
    }

    getAbility(id, { input = undefined } = {}) {
        id = this.database.transformId(id);
        for (let ability of this.getAbilities()) {
            if (ability.id === id) {
                if (input && ability.input !== input) {
                    continue;
                }
                return ability;
            }
        }
        return undefined;
    }

    /**
     * @returns  {boolean} - Returns whether the character has any ability that qualified them for acquiring apps.
     */
    canAcquireApps() {
        return this.getAbility("ability/mid-hacking") ||
            this.getAbility("ability/vti-commanding");
    }

    /**
     * @returns  {Object[]} - Returns the character's apps.
     */
    getApps() {
        return this.data.apps;
    }

    /**
     * @returns  {Object} - Returns the character's inventory.
     */
    getInventory() {
        return this.data.inventory;
    }

    /**
     * @returns  {Object} - Returns the character's items.
     */
    getItems() {
        return this.data.inventory.items;
    }

    /**
     * Whether the character meets a certain set of requirements. Can return a simple bool or a complex object, including the failed requirements.
     * @param {Object[]} requirements - The requirements array. A single requirement is also supported.
     * @param {bool} detailedResult=false (optional) - Whether a detailed result object should be returned including the requirements that are not met.
     * @returns {bool} OR
     * @returns {Object} { result: {bool}, failedRequirements: {Object[]} };
     */
    meetsRequirements(requirements, { detailedResult = false } = {}) {
        let result = { requirementsMet: true, failedRequirements: [] };
        if (!Array.isArray(requirements)) {
            requirements = [requirements];
        }
        for (let requirement of requirements) {
            let collectionName = this.database.getCollectionNameFromId(requirement.id);
            let requirementFailed = false;
            switch (collectionName) {
                case "pri-a":
                    requirementFailed = (!this.getPrimaryAttribute(requirement.id) || this.getPrimaryAttribute(requirement.id).current < requirement.level);
                    break;
                case "sec-a":
                    requirementFailed = (!this.getSecondaryAttribute(requirement.id) || this.getSecondaryAttributeValue(requirement.id) < requirement.level);
                    break;
                case "trait":
                    requirementFailed = (!this.getTrait(requirement.id, { selectedOptionId: requirement.input }));
                    break;
                case "skill":
                    requirementFailed = (!this.getSkill(requirement.id) || this.getSkillLevel(requirement.id) < requirement.level);
                    break;
                case "ability":
                    requirementFailed = (!this.getAbility(requirement.id));
                    break;
                default:
                    switch (requirement.id) {
                        case "character/social-status":
                            requirementFailed = this.getGeneralProperty("socialStatus") < requirement.level;
                            break;
                        default:
                            requirementFailed = true;
                            this.manager.log(`Unable to interpret requirement with id '${requirement.id}'.`, MessageService.messageType.exception);
                    }
            }
            if (requirementFailed) {
                result.requirementsMet = false;
                result.failedRequirements.push(requirement);
            }
        }
        if (detailedResult) {
            return result;
        } else {
            return result.requirementsMet;
        }
    }

    /**
     * Whether the character violates a certain set of restrictions. Can return a simple bool or a complex object, including the violated restrictions.
     * @param {Object[]} requirements - The restrictions array. A single restriction is also supported.
     * @param {bool} detailedResult=false (optional) - Whether a detailed result object should be returned including the restrictions that are violated.
     * @returns {bool} OR
     * @returns {Object} { result: {bool}, failedRequirements: {Object[]} };
     */
    violatesRestrictions(restrictions, { detailedResult = false } = {}) {
        let result = { violated: false, violatedRestrictions: [] };
        if (!Array.isArray(restrictions)) {
            restrictions = [restrictions];
        }
        for (let restriction of restrictions) {
            let collectionName = this.database.getCollectionNameFromId(restriction.id);
            let restrictionViolated = false;
            switch (collectionName) {
                case "pri-a":
                    restrictionViolated = this.getPrimaryAttribute(restriction.id) && this.getPrimaryAttribute(restriction.id).current >= restriction.level;
                    break;
                case "sec-a":
                    restrictionViolated = this.getSecondaryAttribute(restriction.id) && this.getSecondaryAttributeValue(restriction.id) >= restriction.level;
                    break;
                case "trait":
                    restrictionViolated = this.getTrait(restriction.id, { selectedOptionId: restriction.input });
                    break;
                case "skill":
                    restrictionViolated = this.getSkill(restriction.id) && this.getSkillLevel(restriction.id) >= restriction.level;
                    break;
                case "ability":
                    restrictionViolated = this.getAbility(restriction.id);
                    break;
                default:
                    switch (collectionName.id) {
                        case "character/social-status":
                            restrictionViolated = this.getGeneralProperty("socialStatus") < restriction.level;
                            break;
                        default:
                            restrictionViolated = true;
                            this.manager.log(`Unable to interpret restriction with id '${restriction.id}'.`, MessageService.messageType.exception);
                    }
            }
            if (restrictionViolated) {
                result.violated = true;
                result.violatedRestrictions.push(restriction);
            }
        }
        if (detailedResult) {
            return result;
        } else {
            return result.violated;
        }
    }

    /**
     * Applies a list of changes to the character.
     * @param {Object} changes - The changes to apply.
     * @param {Boolean} isGenerator=false - Is the function called during character generation?
     * @param {Boolean} logSuccess=true (optional) - Should success be logged?
     */
    applyChanges(changes, { isGenerator = false, logSuccess = true } = {}) {
        if (!Array.isArray(changes)) {
            changes = [changes];
        }
        for (let change of changes) {
            let collectionName = this.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a": {
                    let primaryAttribute = this.getPrimaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        change.oldLevel = this.getPrimaryAttributeProperty(change.id, change.type);
                        primaryAttribute.setProperty(change.type, change.level, { override: true, logSuccess: logSuccess });
                    } else {
                        primaryAttribute.setProperty(change.type, change.level, { logSuccess: logSuccess });
                    }
                    break;
                }
                case "sec-a": {
                    let secondaryAttribute = this.getSecondaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        change.oldLevel = this.getSecondaryAttributeProperty(change.id, change.type);
                        secondaryAttribute.setProperty(change.type, change.level, { override: true, logSuccess: logSuccess });
                    } else {
                        secondaryAttribute.setProperty(change.type, change.level, { logSuccess: logSuccess });
                    }
                    break;
                }
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (isGenerator && this.generator.getCharacter() === this) {
                        this.generator.setSkillCategoryProperty(change.id, change.type, change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, MessageService.messageType.exception);
            }
        }
    }

    /**
     * Undoes a list of changes to the character.
     * @param {Object} changes - The changes to undo.
     * @param {Boolean} isGenerator=false - Is the function called during character generation?
     * @param {Boolean} logSuccess=true (optional) - Should success be logged?
     */
    undoChanges(changes, { isGenerator = false, logSuccess = true } = {}) {
        if (!Array.isArray(changes)) {
            changes = [changes];
        }
        for (let change of changes) {
            let collectionName = this.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a": {
                    let primaryAttribute = this.getPrimaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        primaryAttribute.setProperty(change.type, change.oldLevel, { override: true, logSuccess: logSuccess });
                    } else {
                        primaryAttribute.setProperty(change.type, -change.level, { logSuccess: logSuccess });
                    }
                    break;
                }
                case "sec-a": {
                    let secondaryAttribute = this.getSecondaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        secondaryAttribute.setProperty(change.type, change.oldLevel, { override: true, logSuccess: logSuccess });
                    } else {
                        secondaryAttribute.setProperty(change.type, -change.level, { logSuccess: logSuccess });
                    }
                    break;
                }
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (isGenerator && this.generator.getCharacter() === this) {
                        this.generator.setSkillCategoryProperty(change.id, change.type, -change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, MessageService.messageType.exception);
            }
        }
    }
}