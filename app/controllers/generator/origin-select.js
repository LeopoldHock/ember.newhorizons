
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import { computed } from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class MainGeneratorOriginSelectController extends Controller {
    @service manager;
    @service database;
    @service stellarpedia;
    @service generator;
    @tracked changeset = Changeset(this.model.data);

    @action onSubmit(event) {
        event.preventDefault();
        let form = event.srcElement;
        if (form.checkValidity()) {
            this.changeset.save();
            let i = 0;
            let skillChoices = [];
            while (this.changeset.get("skill-option-" + i)) {
                let skillChoice = {
                    id: this.changeset.get("skill-option-" + i),
                    level: this.changeset.get("origin.skillOptions")[i].level
                };
                skillChoices.push(skillChoice);
                i++;
            }
            this.generator.setOrigin(this.changeset.get("origin"), this.changeset.get("motherTongue"), skillChoices);
            this.manager.router.replaceWith("generator.personal");
        }
    }

    @computed('disabled', 'generator.originChosen')
    get disableButtons() {
        return this.generator.originChosen;
    }
}