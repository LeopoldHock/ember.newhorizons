import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';


export default class MainGeneratorAttributesRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    async model() {
        let primaryAttributes = [];
        let secondaryAttributes = [];
        if (this.generator.getCharacter()) {
            primaryAttributes = this.generator.getCharacter().data.primaryAttributes;
            secondaryAttributes = this.generator.getCharacter().data.secondaryAttributes;
        }
        return RSVP.hash({
            primaryAttributes: primaryAttributes,
            secondaryAttributes: secondaryAttributes
        });
    }
}
