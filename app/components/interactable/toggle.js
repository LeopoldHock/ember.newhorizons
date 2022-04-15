import InteractableComponent from './interactable';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

/**
 * A simple toggle component.
 * @author Leopold Hock <kontakt@leopoldhock.de>
 * 
 * @param {Object} changeset - A changeset for saving the toggle's state.
 * @param {string} key - The changeset key.
 */

@classic
export default class ToggleComponent extends InteractableComponent {
    @service manager;

    /**
     * Is being triggered when the value is being changed. Invokes an update on the
     * original changeset if supplied.
     * @param {Object} event - The event object.
     */
    @action onChange(event) {
        if (!this.changeset) {
            throw new Error("A changeset must be supplied to the toggle component.");
        }
        if (!this.key) {
            throw new Error("A key must be supplied to the toggle component.");
        }
        this.changeset.set(this.key, event.srcElement.checked);
        if (this.onChangeListener) {
            this.onChangeListener(event, { key: this.key, changeset: this.changeset });
        }
    }
}