import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorAbilitiesRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    model() {
        if (!this.abilityCategories) {
            this.abilityCategories = this.generator.abilityCategories;
            for (let abilityCategory of this.abilityCategories) {
                abilityCategory.collapsibleCollapsedAvailable = true;
                abilityCategory.collapsibleCollapsedOwned = true;
            }
        }
        return RSVP.hash({
            abilitiesMax: this.generator.preset.abilitiesMax,
            abilityCategories: this.abilityCategories,
            abilitiesAvailable: this.database.loadCollection("ability"),
            abilitiesOwned: this.generator.getCharacter()?.data.abilities
        });
    }
}
