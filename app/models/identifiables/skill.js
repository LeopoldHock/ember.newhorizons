import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import Skill from "new-horizons/game/identifiables/skill";

export default class DatabaseSkillModel extends DatabasePrefabModel {
    @service manager;
    @service database;
    @service generator;
    @service editor;

    @attr() skillCategory;
    @attr() factor;
    @attr() constraint;
    @attr() current;
    @attr() min;
    @attr() max;
    @attr() primaryAttributes;
    @attr() hasSpecialisations;
    @attr() isBasic;
    @attr() baseValue;
    @attr() requirements;
    @attr() specialExperience;

    /**
     * Adds the skill to the given character.
     * @param  {bool} logSuccess=true (optional) - Whether success should be logged.
     * @param  {bool} updateSkill=true (optional) - Whether the skill should be updated afterwards.
     * @param  {bool} isGenerator=false (optional) - Is the process being called from generator or editor?
     * @param  {bool} allowRemove=true (optional) - Should removing the skill during the same session be allowed?
     * @returns  {Object} - The added skill.
     */
    addToCharacter(character, { logSuccess = true, updateSkill = true, isGenerator = false, allowRemove = true } = {}) {
        let skill = new Skill({ data: this.manager.database.getIdentifiable(this.id, { clone: true }), context: this, isGenerator: isGenerator });
        skill.add(character, { logSuccess: logSuccess, updateSkill: updateSkill, allowRemove: allowRemove });
        return skill;
    }
}