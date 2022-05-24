//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Inputfield'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class InputfieldComponent extends InteractableComponent {
    @service manager;
    @tracked labelPosition = "top";
    @tracked textPosition = "left";
    @tracked value;
    @tracked valueSuffix; // Shown before the value when inputfield is not currently being focused
    @tracked valueCombined; // Shown after the value when inputfield is not currently being focused
    @tracked pattern;
    @tracked invalid = false;
    @tracked hideInvalidity = true;

    init() {
        super.init();
        // if 'required' is true, but no pattern specified, default to 'any' pattern
        if (this.required && !this.pattern) {
            this.set("pattern", this.manager.pattern.any);
        }
    }

    @action onChange(event) {
        this.changeset.set(this.key, event.srcElement.value);
        if (this.onChangeListener) {
            this.onChangeListener(event, { key: this.key, changeset: this.changeset });
        }
    }

    @action onInvalid() {
        // expose invalidity to user
        this.set("hideInvalidity", false);
    }

    @action onInputDidInsert(element) {
        // add event listeners
        if (this.eventListeners) {
            for (let listener of this.eventListeners) {
                element.addEventListener(listener.event, listener.function);
            }
        }
    }
}