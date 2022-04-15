//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// This service manages the character generation process.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { set, action } from '@ember/object';
import { inject as service } from '@ember/service';
import Character from 'new-horizons/game/character-v1';
import { A } from '@ember/array';

export default class GeneratorService extends Service {
    @service manager;
    @service database;

    @tracked character;
    @tracked preset;
    @tracked generationInProcess = false;
    @tracked originChosen = false;

    @tracked apAvailable;
    @tracked ipAvailable;
    @tracked ipTotal;

    @tracked gpAvailable;
    @tracked gpBonus;

    getCharacter() {
        let character = this.character;
        return character;
    }

    @action initializeGeneration(characterPreset, { preventRouting = false } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-13
        // Description:
        // This method is used to initialize character generation.
        //----------------------------------------------------------------------------//
        let character = new Character(characterPreset.id, this.manager.appVersion, { context: this });
        set(this, "preset", characterPreset);
        set(this, "character", character);
        if (!preventRouting) {
            this.manager.goToRoute("generator.origin");
        }
        set(this, "generationInProcess", true);
        set(this, "originChosen", false);
        // Initialize primary attributes
        this.manager.database.getCollection("pri-a").forEach(function (priA) {
            priA.addToCharacter(character);
        });
        // Initialize secondary attributes
        this.manager.database.getCollection("sec-a").forEach(function (secA) {
            secA.addToCharacter(character);
        });
        // Add all basic skills
        this.manager.database.getCollection("skill").forEach(function (skill) {
            if (skill.isBasic) {
                skill.addToCharacter(character, { logSuccess: false });
            }
        });
        // initialize gp, ap and ip budgets
        this.apAvailable = characterPreset.apAvailable;
        this.gpAvailable = 0 + characterPreset.gpBonus;
        this.ipAvailable = characterPreset.ipAvailable;
        // initialize categories
        this.initializeSkillCategories();
        this.initializeAbilityCategories();
        this.initializeAppCategories();
    }

    setOrigin(origin, motherTongue, skillChoices) {
        // set origin
        this.getCharacter().data.origin = origin.id;
        // increase the special primary attribute
        let specialPrimaryAttribute = this.getCharacter().getPrimaryAttribute(origin.specialPA);
        let specialPriABonus = this.database.getIdentifiable("constant/special-pri-a-bonus").value;
        specialPrimaryAttribute.setProperty("current", specialPriABonus, { logSuccess: false });
        specialPrimaryAttribute.setProperty("min", specialPriABonus, { logSuccess: false });
        specialPrimaryAttribute.setProperty("max", specialPriABonus, { logSuccess: false });
        // add and/or increase all fixed skills
        for (let skill of origin.skillsFixed) {
            let ownedSkill = this.getCharacter().getSkill(skill.id);
            if (!ownedSkill) {
                let skillRecord = this.database.getIdentifiable(skill.id);
                ownedSkill = skillRecord.addToCharacter(this.getCharacter(), { logSuccess: false, updateSkill: false, allowRemove: false });
            }
            ownedSkill.setLevel(skill.level, { logSuccess: false, validate: false, updateSkill: false });
            ownedSkill.update({ logSuccess: false, updateMinimum: true });
        }
        // add and/or increase all chosen skills
        for (let skill of skillChoices) {
            let ownedSkill = this.getCharacter().getSkill(skill.id);
            if (!ownedSkill) {
                let skillRecord = this.database.getIdentifiable(skill.id);
                ownedSkill = skillRecord.addToCharacter(this.getCharacter(), { logSuccess: false, updateSkill: false, allowRemove: false });
            }
            ownedSkill.setLevel(skill.level, { logSuccess: false, validate: false, updateSkill: false });
            ownedSkill.update({ logSuccess: false, updateMinimum: true });
        }
        // add the character's mother tongue as an ability
        let motherTongueAbility = this.database.getIdentifiable("Ability_General_Language");
        motherTongueAbility.addToCharacter(this.getCharacter(), { input: motherTongue, logSuccess: false });

        // update status
        this.manager.log(`Applied origin '${origin.id}' to character '${this.getCharacter().name}'.`);
        set(this, "originChosen", true);
    }

    @action logStatus() {
        console.log(this.getCharacter().data);
    }

    /**
     * Sets the current generation points.
     * @param  {number} value - The value to override or increase/decrease. Can be negative.
     * @param  {bool} override=false (optional) - Should the previous value be overriden or increased/decreased?
     */
    @action setGp(value, { override = false } = {}) {
        let oldValue = this.gpAvailable;
        if (override) {
            set(this, "gpAvailable", value);
        } else {
            set(this, "gpAvailable", oldValue + value);
        }
    }

    @action setAp(value, { override = false } = {}) {
        let oldValue = this.apAvailable;
        if (override) {
            set(this, "apAvailable", value);
        } else {
            set(this, "apAvailable", oldValue + value);
        }
    }

    @action setIp(value, { override = false } = {}) {
        let oldValue = this.ipAvailable;
        if (override) {
            set(this, "ipAvailable", value);
        } else {
            set(this, "ipAvailable", oldValue + value);
        }
    }

    initializeSkillCategories() {
        let that = this;
        this.skillCategories = [];
        this.manager.database.getCollection("skill-category").forEach(function (skillCategory) {
            that.skillCategories.pushObject(that.manager.database.cloneRecord(skillCategory));
        });
    }

    initializeAbilityCategories() {
        let that = this;
        this.abilityCategories = [];
        this.manager.database.getCollection("ability-category").forEach(function (abilityCategory) {
            that.abilityCategories.pushObject(that.manager.database.cloneRecord(abilityCategory));
        });
    }

    initializeAppCategories() {
        let that = this;
        this.appCategories = [];
        this.manager.database.getCollection("app-category").forEach(function (appCategory) {
            that.appCategories.pushObject(that.manager.database.cloneRecord(appCategory));
        });
    }

    updateSkillCategories() {
        for (let category of this.skillCategories) {
            let skillCategory = this.manager.clone(category);
            let skillsAvailable = this.database.getCollection("skill");
            set(skillCategory, "skillsAvailable", A([]));
            for (let skill of skillsAvailable.toArray()) {
                if (this.database.transformId(skill.skillCategory) === this.database.transformId(category.id)) {
                    skillCategory.skillsAvailable.pushObject(skill);
                }
            }
            let skillsOwned = this.getCharacter().getSkills();
            set(skillCategory, "skillsOwned", A([]));
            for (let skill of skillsOwned) {
                if (this.database.transformId(skill.skillCategory) === this.database.transformId(category.id)) {
                    skillCategory.skillsOwned.pushObject(skill);
                }
            }
        }
    }

    /**
     * Returns all available and owned skills, but distributed among their categories.
     * @returns  {Object[]}
     */
    get detailedSkillCategories() {
        let categories = this.skillCategories;
        let result = [];
        for (let category of categories) {
            let skillCategory = this.manager.clone(category);
            let skillsAvailable = this.database.getCollection("skill");
            skillCategory.skillsAvailable = [];
            for (let skill of skillsAvailable.toArray()) {
                if (this.database.transformId(skill.skillCategory) === this.database.transformId(category.id)) {
                    skillCategory.skillsAvailable.push(skill);
                }
            }
            let skillsOwned = this.getCharacter().getSkills();
            skillCategory.skillsOwned = [];
            for (let skill of skillsOwned) {
                if (this.database.transformId(skill.skillCategory) === this.database.transformId(category.id)) {
                    skillCategory.skillsOwned.push(skill);
                }
            }
            result.push(skillCategory);
        }
        return result;
    }

    @action setSkillCategoryProperty(categoryId, property, value) {
        for (let category of this.skillCategories) {
            if (this.database.transformId(category.id) === this.database.transformId(categoryId)) {
                set(category, property, category[property] + value);
            }
        }
    }

    /**
     * Generates a dummy character for development purposes.
     */
    async generateDummyCharater() {
        let preset = {
            id: "Dummy",
            gpBonus: 0,
            apAvailable: 32,
            traitsMin: 5,
            traitsMax: 15,
            abilitiesMax: 4,
            ipAvailable: 100,
            epStart: 0,
            crStart: 0,
            fpStart: 1
        };
        this.initializeGeneration(preset, { preventRouting: true });
        let origin = this.database.getIdentifiable("origin/earth-urban");
        let skillChoices = [];
        for (let skillOption of origin.skillOptions) {
            skillChoices.push({ id: skillOption.options[0], level: skillOption.level });
        }
        this.setOrigin(origin, "Solaire", skillChoices);
    }
}