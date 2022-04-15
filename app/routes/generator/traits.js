import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorTraitsRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    async model() {
        // let traitsAvailable = await this.database.loadCollectionAsList("trait");
        await this.database.loadCollection("trait");
        await this.database.loadCollection("skill");
        await this.database.loadCollection("constant");
        return RSVP.hash({
            traitsAvailable: this.database.getCollection("trait"),
            traitsOwned: this.generator.getCharacter()?.data.traits,
            traitsMin: this.generator.preset.traitsMin,
            traitsMax: this.generator.preset.traitsMax
        });
    }
}
