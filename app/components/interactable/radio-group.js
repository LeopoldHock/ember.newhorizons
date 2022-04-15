//----------------------------------------------------------------------------//
// Leopold Hock / 2021-05-02
// Description:
// Controller for component interactable::radio-group.
// Expects:
//      - 'changeset' ember-changeset object
//      - 'key' for changeset property
//      - 'options' array: [{
//          caption: "The text that should be displayed",
//          value: "The value to set changeset.key" }]
//      - 'onChangeListener' function to listen to the onChange event (optional)
//      - 'default' value: must match an option value (optional)
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class RadioGroupComponent extends InteractableComponent {
    @service manager;
    @tracked disabled = false;
    @tracked busy = false;
    defaultOption;
    defaultWasSet = false;
    labelPosition = "top";

    init() {
        super.init();
        let options = this.get("options");
        for (let option of options) {
            option.checked = false;
            if (this.default && option.value === this.default) {
                this.defaultOption = option;
            }
        }
        if (!this.defaultOption) {
            this.defaultOption = options[0];
        }
        this.defaultOption.checked = true;
    }

    didRender() {
        if (!this.defaultWasSet) {
            this.onChange(this.defaultOption.value);
            this.defaultWasSet = true;
        }
    }

    get isDisabled() {
        return (this.get("disabled") || this.get("busy"));
    }

    @action onChange(value) {
        this.changeset.set(this.key, value);
        if (this.onChangeListener) {
            this.onChangeListener(value, { key: this.get("key"), changeset: this.get("changeset") });
        }
    }
}