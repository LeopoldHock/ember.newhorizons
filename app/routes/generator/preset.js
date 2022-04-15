import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorPresetRoute extends Route {
    @service database;

    model() {
        return RSVP.hash({
            characterPresets: this.database.loadCollection("character-preset"),
            constants: this.database.loadCollection("constant"),
            primaryAttributes: this.database.loadCollection("pri-a"),
            secondaryAttributes: this.database.loadCollection("sec-a"),
            skillCategories: this.database.loadCollection("skill-category"),
            skills: this.database.loadCollection("skill"),
            abilityCategories: this.database.loadCollection("ability-category")
        });
    }

    @action
    didTransition() {
        return true;
    }
}
