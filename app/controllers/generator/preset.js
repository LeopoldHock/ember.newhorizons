//  Leopold Hock | 30.04.2020
//  Description: Controller for template "generator/preset". The Preset Route is the start of the Character generation process.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import TutorialBoxComponent from 'new-horizons/components/misc/tutorial-box';

export default class GeneratorPresetController extends Controller {
    @service manager;
    @service database;
    @service generator;

    @tracked currentPreset;
    @tracked changeset = Changeset({});
    @tracked allDisabled = true;
    @tracked isModified = false;

    @tracked generatorSettings = {
        showTutorials: true
    };
    @tracked generatorSettingsChangeset = Changeset(this.generatorSettings);

    init() {
        super.init();
    }

    @action onChangePreset(selectedItem) {
        this.currentPreset = this.database.getIdentifiable(selectedItem.id);
        this.currentPreset.set("isCustom", this.changeset.isCustom);
        this.set("changeset", Changeset(this.currentPreset));
        this.isModified = false;
    }

    @action onCustomToggle(event) {
        if (!event.srcElement.checked) {
            // reset preset when 'custom' is being turned off
            this.onChangePreset(this.database.getIdentifiable(this.changeset.get("id")));
        }
    }

    @action onTutorialsToggle(event) {
        if (event.srcElement.checked) {
            TutorialBoxComponent.enableAllTutorials(this.generator);
        } else {
            TutorialBoxComponent.disableAllTutorials(this.generator);
        }
    }

    @action onSubmit(event) {
        event.preventDefault();
        let that = this;
        // Check whether character generation is currently already running to prevent data loss
        if (this.generator.getCharacter()) {
            // If there is, ask the user whether he wants to restart generation and lose all progress
            let modalParams = {
                type: "warning",
                title: "modal/restart-generation/title",
                text: ["modal/restart-generation/text"],
                yesLabel: "Misc_Ok",
                noLabel: "Misc_Cancel"
            };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                    that.changeset.save();
                    that.generatorSettingsChangeset.save();
                    that.generator.initializeGeneration(that.changeset.data);
                }
            };
            that.manager.callModal("confirm", modalParams, [yesListener]);

        } else {
            // If there isn't, proceed with initializing the generation
            this.changeset.save();
            this.generator.initializeGeneration(this.changeset.data);
        }
    }
}