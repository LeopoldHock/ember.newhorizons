//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-21
// Description:
// Controller for component interactable::button.
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class CollapsibleComponent extends InteractableComponent {
    @service manager;
    @tracked collapsed = true;
    @tracked noPadding = false;
    @tracked size = "medium";

    @tracked showCounter = false;
    @tracked counterLabel;
    @tracked counterValue;
    @tracked counterMin;
    @tracked counterMax;

    @action willRender() {
        if (this.counterValue) {
            this.showCounter = true;
        }
    }

    get counterState() {
        if (this.counterMin !== undefined && this.counterValue < this.counterMin) {
            return "error";
        } else if (this.counterMax !== undefined && this.counterValue > this.counterMax) {
            return "error";
        } else {
            return "default";
        }
    }

    // @action onClick() {
    //     this.collapsed = !this.collapsed;
    //     // set(this, "collapsed", !this.collapsed);
    // }
}