//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-17
// Description:
// Abilities list. Expects a 'abilities' array in the 'list' format.
//----------------------------------------------------------------------------//
import ListComponent from './list';
import { tracked } from '@glimmer/tracking';
import { set, action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ListAbilitiesComponent extends ListComponent {
    @service manager;
    @service database;
    @service generator;

    @tracked abilityCategory;
    @tracked character;
    @tracked isGenerator = false;
    @tracked isOwned = false;
    @tracked hideOwned = true;

    get rows() {
        let result = [];
        // filter for ability category if one has been supplied
        for (let row of super.rows) {
            if (this.abilityCategory) {
                if (this.database.transformId(row.data.abilityCategory) !== this.database.transformId(this.abilityCategory)) {
                    continue;
                }
            }
            if (this.hideOwned && !this.isOwned && typeof this.character !== "undefined") {
                if (this.character.getAbility(row.data.id)) {
                    continue;
                }
            }
            result.push(row);
        }
        return result;
    }

    @action onAddClick(row) {
        // Check requirements
        let requirementCheckResult = this.generator.getCharacter().meetsRequirements(row.data.requirements, { detailedResult: true });
        if (!requirementCheckResult.requirementsMet) {
            this.manager.callModal("game/requirements-failed", [{ name: "identifiable", value: row.data },
            { name: "failedRequirements", value: requirementCheckResult.failedRequirements }]);
            return;
        }

        // Add the ability
        let addedAbility;
        if (row.data.needsInput) {
            // If trait needs input,  check for valid input and whether the character has the same trait with the same input
            if (this.manager.isNullOrWhitespace(row.changeset.input)) {
                set(row, "invalid", true);
            } else if (this.generator.getCharacter().getTrait(row.data.id, { input: row.changeset.input })) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedAbility = row.data.addToCharacter(this.generator.getCharacter(), { input: row.changeset.input, isGenerator: this.isGenerator });
                row.changeset.rollback();
            }
        } else if (row.data.hasOptions) {
            // If trait has options, check whether the character has the same trait with the same option
            if (this.generator.getCharacter().getTrait(row.data.id, { selectedOptionId: row.data.selectedOption.id })) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedAbility = row.data.addToCharacter(this.generator.getCharacter(), { selectedOption: row.data.selectedOption, isGenerator: this.isGenerator });
            }
        } else {
            // Else, just check whether the character already has that trait
            if (this.generator.getCharacter().getTrait(row.data.id)) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedAbility = row.data.addToCharacter(this.generator.getCharacter(), { isGenerator: this.isGenerator });
            }
        }

        if (addedAbility) {
            if (this.isGenerator) {
                this.generator.setGp(-this.database.calculateAbilityCosts(row.data.costs, { useGp: true }));
            } else {
                this.generator.setEp(-this.database.calculateAbilityCosts(row.data.costs, { useGp: false }));
            }

        }
    }

    @action onRemoveClick(row) {
        let removedAbility = this.generator.getCharacter().getTrait(row.data.id, { input: row.data.input, selectedOptionId: row.data.selectedOption.id }).remove();
        if (removedAbility) {
            if (this.isGenerator) {
                this.generator.setGp(this.database.calculateAbilityCosts(row.data.costs, { useGp: true }));
            } else {
                this.generator.setEp(this.database.calculateAbilityCosts(row.data.costs, { useGp: false }));
            }
        }
    }
}