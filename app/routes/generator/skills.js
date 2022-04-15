import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorSkillsRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    model() {
        if (!this.skillCategories) {
            this.skillCategories = this.generator.skillCategories;
            for (let skillCategory of this.skillCategories) {
                skillCategory.collapsibleCollapsedAvailable = true;
                skillCategory.collapsibleCollapsedOwned = true;
            }
        }
        return RSVP.hash({
            skillCategories: this.skillCategories,
            ipAvailable: this.generator.ipAvailable,
            skillsAvailable: this.database.getCollection("skill"),
            skillsOwned: this.generator.getCharacter().getSkills(),
            character: this.generator.getCharacter()
        });
    }
}
