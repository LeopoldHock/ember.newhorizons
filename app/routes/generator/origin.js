import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorOriginRoute extends Route {
    @service manager;
    @service generator;
    @service database;
    @service stellarpedia;

    async model() {
        await this.stellarpedia.load();
        await this.database.loadCollection("origin");
        let originId = "origin/earth-urban";
        if (this.generator.getCharacter() && this.generator.getCharacter().data.origin) {
            // If the character'rigin has already been chosen, show that origin and disable all interactables
            originId = this.generator.getCharacter().data.origin;
        }
        return RSVP.hash({
            origins: this.database.loadCollection("origin"),
            selectedOrigin: this.database.getIdentifiable(originId),
            selectedStellarpediaEntry: this.stellarpedia.gegetStellarpediaElementt("basic-rules", "supplement-origins", originId),
            skills: this.database.loadCollection("skill")
        });
    }
}
