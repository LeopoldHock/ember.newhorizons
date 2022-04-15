//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// The database manages the database and ruleset.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import MessageService from './message-service';

export default class DatabaseService extends Service {
    @service manager;
    @service store;

    async loadCollection(collectionName) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-05
        // Description:
        // Loads a collectioon.
        //----------------------------------------------------------------------------//
        let transformedCollectionName = this.transformId(collectionName);
        let result = this.store.peekAll("identifiables/" + transformedCollectionName);
        if (result.content.length > 0) {
            return result;
        } else {
            result = await this.store.findAll("identifiables/" + transformedCollectionName);
            return result;
        }
    }

    getCollection(collectionName) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-08
        // Description:
        // Finds a collection in the database.
        //----------------------------------------------------------------------------//
        let transformedCollectionName = this.transformId(collectionName);
        let result = this.store.peekAll("identifiables/" + transformedCollectionName);
        return result;
    }

    getIdentifiable(id, { clone = false, serialize = false } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Finds any identifiable in the database.
        //----------------------------------------------------------------------------//
        let transformedId = this.transformId(id);
        let splitTransformedId = transformedId.split('/');
        if (splitTransformedId.length > 1) {
            let collectionId = splitTransformedId[0];
            let result = this.store.peekRecord("identifiables/" + collectionId, transformedId);
            if (result) {
                if (clone) {
                    return this.cloneRecord(result);
                } else if (serialize) {
                    return result.serialize();
                } else {
                    return result;
                }
            }
            this.manager.log(`Unable to find object with ID '${transformedId}' in collection '${collectionId}'.`, MessageService.messageType.error);
            return undefined;
        } else {
            this.manager.log(`ID '${transformedId}' has an invalid format and cannot be retrieved from any collection.`, MessageService.messageType.exception);
            return undefined;
        }
    }

    getDataFromPath(path) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // This returns a data entry's property from a path like it is used in the
        // Stellarpedia.
        //----------------------------------------------------------------------------//
        let pathSplit = path.split(";");
        let object = this.getIdentifiable(pathSplit[1]);
        if (object) {
            // use the property name if specified or 'value' by defualt
            let propertyName = pathSplit[2];
            if (!propertyName) propertyName = "value";
            let result = object[propertyName];
            if (result) return result;
        }
        return undefined;
    }

    transformId(id) {
        // Transforms an id by replacing underscores by slashes and dasherizes it
        let result = id.replaceAll("_", "/");
        let split = result.split("/");
        for (let i = 0; i < split.length; i++) {
            let part = split[i];
            part = part.charAt(0).toLowerCase() + part.slice(1);
            let regex = /[A-Z]+(?![a-z,\d])|[A-Z]?[a-z,\d]+|\d\+/g;
            if (part.match(regex)) {
                part = part.match(regex).join('-');
            }
            part = part.toLowerCase();
            split[i] = part;
        }
        result = split.join("/");
        return result;
    }

    getCollectionNameFromId(id) {
        let transformedId = this.transformId(id);
        let split = transformedId.split("/");
        let collectionName = split[0];
        return collectionName;
    }

    cloneRecord(record) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-06
        // Description:
        // Clones a database record by extracting the data from the model record
        // and returning a copy of it.
        //----------------------------------------------------------------------------//
        if (typeof record.getRecord === "function") record = record.getRecord();
        return this.manager.clone(record.serialize(), record.id);
    }

    parseMathFunction(functionString) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-06-05
        // Description:
        // This function can process mathematical functions that are encoded within
        // some database records by making use of JavaScript's eval().
        // The function has to be encoded as below:
        // <skill/combat/heavy-weapons.factor>
        //      would return nested property 'factor' of identifiable
        //      'skill/combat/heavy-weapons'
        // "<constant/skills-default-factor-physical.value> * <constant/traits-inability-bonus-multiplier.value>"
        //      would return product of the identifiable's properties
        //----------------------------------------------------------------------------//
        let dataRefRegex = /<(.*?)>/g;
        let matches = [...functionString.matchAll(dataRefRegex)];
        let transcribedString = functionString;
        for (let match of matches) {
            let dataPath = match[1];
            if (dataPath.includes(".")) {
                let split = dataPath.split(".");
                let identifiable = this.getIdentifiable(split[0]);
                split.splice(0, 1);
                let propertyPath = split.join(".");
                let dataResult = this.manager.getNestedProperty(identifiable, propertyPath);
                if (dataResult) {
                    transcribedString = transcribedString.replace(match[0], dataResult);
                }
            }
        }
        let result = eval(transcribedString);
        if (typeof result === "number") {
            return result;
        } else {
            return undefined;
        }
    }
    /**
     * Returns a specific constant.
     * @param  {string} id
     * @returns {number}
     */
    getConstant(id) {
        let result;
        let constant = this.getIdentifiable(id);
        if (constant) {
            result = constant.value;
        }
        return result;
    }

    /**
     * Calculates the costs for buying a skill or for a certain skill level.
     * @param  {string} level - The skill's level.
     * @param  {number} factor - The skill's factor.
     * @param  {bool} buy=false (optional) - Calculate costs for buying an unowned skill.
     * @param  {bool} useInterestPoints=false (optional) - Return the costs in form of interests point as used in the generator.
     * @returns {number}
     */
    calculateSkillCosts(level, factor, { buy = false, useInterestPoints = false } = {}) {
        let result;
        if (useInterestPoints) {
            if (buy) {
                result = factor;
            } else {
                result = 1;
            }
        } else {
            if (buy) {
                return factor * this.getConstant("constant/skills-buy-multiplier");
            } else {
                return this.getConstant("constant/skills-cost-min") + level ^ (this.getConstant("constant/skills-cost-exponent")) * factor;
            }
        }
        return result;
    }

    /**
     * Calculates the costs for buying a trait.
     * @param  {Object} trait - The trait.
     * @returns  {number}
     */
    calculateTraitCosts(trait) {
        if (trait.selectedOption && trait.selectedOption.changesCost) {
            if (this.manager.tryParseInt(trait.selectedOption.value) !== false) {
                // If it's a numeric value, set it accordingly
                return this.manager.tryParseInt(trait.selectedOption.value);
            } else {
                // if it's not, parse it as a mathematical function and get the result
                let newCost = this.manager.database.parseMathFunction(trait.selectedOption.value);
                return newCost;
            }
        } else {
            return trait.costs;
        }
    }

    /**
     * Calculates the costs for an ability.
     * @param {Object} ability - The ability.
     * @param {Boolean} useGp - Whether the costs should be returned in generation points.
     * @returns {Number} - The costs.
     */
    calculateAbilityCosts(ability, { useGp } = {}) {
        let result = ability.costs;
        if (useGp) {
            result = Math.round(ability.costs / 100);
        }
        return result;
    }
}