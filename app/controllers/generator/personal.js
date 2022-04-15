
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorPersonalController extends Controller {
    @service manager;
    @service database;
    @service generator;

    @tracked changeset = Changeset(this.model);

    @action onChange(event, data) {
        data.changeset.save();
        this.generator.getCharacter().setGeneralProperty(data.key, data.changeset.get(data.key));
    }

    @action onChangeSocialStatus(event, { step } = {}) {
        this.changeset.set("socialStatus", this.changeset.get("socialStatus") + step);
        this.changeset.save();
        if (this.generator.getCharacter().setGeneralProperty("socialStatus", this.changeset.get("socialStatus")) !== undefined) {
            this.generator.setGp(-1 * step);
        }
    }
}