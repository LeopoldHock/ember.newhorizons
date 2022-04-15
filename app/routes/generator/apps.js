import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorAppsRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    model() {
        let showNoApps = !this.generator.getCharacter().canAcquireApps();
        return RSVP.hash({
            showNoApps: showNoApps,
            apps: this.database.loadCollection("app")
        });
    }
}
