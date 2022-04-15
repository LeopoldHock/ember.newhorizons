import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorPersonalRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    async model() {
        await this.database.loadCollection("constant");
        return RSVP.hash({
            name: "",
            sex: "",
            age: "",
            birthday: "",
            height: "",
            weight: "",
            appearance: "",
            family: "",
            socialStatus: 1,
            socialStatusMin: 1,
            socialStatusMax: this.database.getIdentifiable("constant/social-status-max").value
        });
    }
}
