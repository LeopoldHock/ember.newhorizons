//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-17
// Description:
// Skills list. Expects a 'skills' array in the 'list' format.
//----------------------------------------------------------------------------//
import ListComponent from './list';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ListSkillsComponent extends ListComponent {
    @service manager;
    @service database;
    @service generator;

    @tracked skillCategory;
    @tracked character;
    @tracked isGenerator = false;
    @tracked isOwned = false;
    @tracked hideOwned = true;

    get rows() {
        let result = [];
        // filter for skill category if one has been supplied
        for (let row of super.rows) {
            if (this.skillCategory) {
                if (this.database.transformId(row.data.skillCategory) !== this.database.transformId(this.skillCategory)) {
                    continue;
                }
            }
            if (this.hideOwned && !this.isOwned && typeof this.character !== "undefined") {
                if (this.character.getSkill(row.data.id)) {
                    continue;
                }
            }
            result.push(row);
        }
        return result;
    }

    @action onAddClick(row) {
        // check whether character already owns skill
        if (this.character.getSkill(row.data.id)) {
            this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsSkill_Title" }, { name: "text", value: ["Modal_CharacterOwnsSkill_Text"] }]);
            return;
        }
        let costs = this.database.calculateSkillCosts(row.data.level, row.data.factor, { buy: true, useInterestPoints: this.isGenerator });
        if (row.data.addToCharacter(this.generator.getCharacter(), { isGenerator: this.isGenerator })) {
            if (this.isGenerator) {
                this.generator.setSkillCategoryProperty(row.data.skillCategory, "available", -costs);
            } else {
                // not yet implemented
            }
        }
    }

    @action onRemoveClick(row) {
        let costs = this.database.calculateSkillCosts(row.data.level, row.data.factor, { buy: true, useInterestPoints: this.isGenerator });
        if (row.data.remove()) {
            if (this.isGenerator) {
                this.generator.setSkillCategoryProperty(row.data.skillCategory, "available", costs);
            } else {
                // not yet implemented
            }
        }
    }

    @action onLevelChange(event, { object, step } = {}) {
        let costs = this.database.calculateSkillCosts(object.level, object.factor, { useInterestPoints: this.isGenerator });
        if (this.isGenerator) {
            object.setLevel(step);
            this.generator.setSkillCategoryProperty(object.skillCategory, "available", step * -costs);
        } else {
            // not yet implemented
        }
    }
}