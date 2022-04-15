//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-21
// Description:
// Controller for component interactable::button.
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class ButtonComponent extends InteractableComponent {
    @service manager;
    @tracked disabled = false;
    @tracked busy = false;

    get isDisabled() {
        return this.disabled || this.busy;
    }

    @action handleClick() {
        if (typeof this.onClick === "function") {
            this.onClick();
        }
    }
}