
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import classic from 'ember-classic-decorator';

@classic
export default class MainGeneratorOriginController extends Controller {
    @service manager;
    @service database;
    @service stellarpedia;
    @service generator;
    @tracked changeset = Changeset({});

    init() {
        super.init();
    }

    @action onChangeOrigin(selectedItem) {
        this.set("model.selectedOrigin", this.database.getIdentifiable(selectedItem.id));
        // this.model.selectedOrigin = this.database.getIdentifiable(selectedItem.id);
        this.set("model.selectedStellarpediaEntry", this.stellarpedia.getStellarpediaElement("basic-rules", "supplement-origins", selectedItem.id));
        // this.model.selectedStellarpediaEntry = this.stellarpedia.getStellarpediaElement("basic-rules", "supplement-origins", selectedItem.id);
    }

    @action onSubmit() {
        let reduced_origin_id = this.model.selectedOrigin.id.split("/")[1];
        this.manager.router.transitionTo("generator.origin-select", reduced_origin_id);
    }
}