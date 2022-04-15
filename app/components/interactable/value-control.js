//----------------------------------------------------------------------------//
// Leopold Hock / 2021-05-14
// Description:
// value-control is a component that is used for editing numeric properties of
// characters. It does not implement ember-changeset because it is assumed that
// those kind of values are always set through character object functions that
// offer complex interfaces, their own validation, logging or determinations.
// onChangeListener can be assigned a function that should be called after
// each change.
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class InputfieldComponent extends InteractableComponent {
    @service manager;
    @tracked labelPosition = "top";
    @tracked textPosition = "right";
    @tracked size = "small";
    step = 1;
    @tracked showButtons = true;
    @tracked budget;
    @tracked budgetMin = 1;


    init() {
        super.init();
    }

    @computed("disabled", "value", "min")
    get isDecreaseDisabled() {
        return (this.disabled || (this.getMin() !== undefined && this.value - this.step < this.getMin()));
    }

    @computed("disabled", "value", "max", "budget")
    get isIncreaseDisabled() {
        if (this.disabled) {
            return true;
        } else {
            if (this.budget !== undefined && this.budget < this.budgetMin) {
                return true;
            } else {
                return this.getMax() !== undefined && this.value + this.step > this.getMax();
            }
        }
    }

    getMin() {
        if (this.get("min") !== undefined) {
            return this.get("min");
        } else {
            return undefined;
        }
    }

    getMax() {
        if (this.get("max") !== undefined) {
            return this.get("max");
        } else {
            return undefined;
        }
    }

    @action onDecreaseClick(event) {
        let oldValue = this.value;
        let newValue = oldValue - this.step;
        if (this.getMin() !== undefined && newValue < this.getMin()) {
            return;
        }
        if (this.onChangeListener) {
            this.onChangeListener(event, { object: this.get("object"), key: this.get("key"), step: -1 * this.step });
        }
    }

    @action onIncreaseClick(event) {
        let oldValue = this.value;
        let newValue = oldValue + this.step;
        if (this.getMax() !== undefined && newValue > this.getMax()) {
            return;
        }
        if (this.onChangeListener) {
            this.onChangeListener(event, { object: this.get("object"), key: this.get("key"), step: this.step });
        }
    }
}