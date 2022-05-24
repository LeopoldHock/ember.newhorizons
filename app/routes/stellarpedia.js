import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';
import { getOwner } from '@ember/application';
import RSVP from 'rsvp';

export default class StellarpediaRoute extends Route {
    @service manager;
    @service router;
    @service stellarpedia;
    @service database;

    async model(params, transition) {
        // make sure scroll position will be adjusted to focus the targeted entry
        const stellarpedia = getOwner(this).lookup('service:stellarpedia');
        // remember returnRoute
        if (transition.from) {
            if (transition.from.name !== transition.to.name) {
                set(stellarpedia, "returnRoute", transition.from.name);
            }
        }
        // load collections
        await this.database.loadCollection("constant");
        await this.database.loadCollection("pri-a");
        await this.database.loadCollection("sec-a");
        await this.database.loadCollection("origin");
        await this.database.loadCollection("trait");
        await this.database.loadCollection("ability");
        await this.database.loadCollection("skill");
        await this.database.loadCollection("app");
        // load stellarpedia
        await this.stellarpedia.load();
        // get the full adress and split it
        let full_entry_adress = params.full_entry_adress;
        let split = full_entry_adress.split("+");
        if (split.length === 3) {
            if (this.stellarpedia.setSelectedEntry(split[0], split[1], split[2])) {
                // get and load the required database collections
                await this.stellarpedia.loadRequiredDatabaseCollections(split[0], split[1], split[2]);
                return RSVP.hash({
                    entry: this.stellarpedia.getStellarpediaElement(split[0], split[1], split[2]),
                    sidebarData: this.stellarpedia.sidebarData
                });
            } else {
                throw new Error("Stellarpedia entry not found.");
            }
        } else {
            throw new Error("Address of Stellarpedia entry has a wrong format.");
        }
    }

    @action error() {
        this.intermediateTransitionTo("/page-not-found");
    }
}
