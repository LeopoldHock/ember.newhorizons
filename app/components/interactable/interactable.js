//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-24
// Description:
// Parent class for all interactable UI components.
//----------------------------------------------------------------------------//

import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class InteractableComponent extends Component {
    @service manager;
    @tracked focus = false;
    @tracked style;
    initialRender = true;

    init() {
        super.init();
    }

    @action willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-24
        // Description:
        // Triggered before interactable component will render.
        //----------------------------------------------------------------------------//
        super.willRender();
    }

    @action didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-24
        // Description:
        // Triggered after interactable component has been rendered.
        //----------------------------------------------------------------------------//
        super.didRender();
        if (!this.initialRender) return;
        this.initialRender = false;
        let componentElement = this.parentView?.element;
        if (componentElement) {
            let interactables = componentElement.getElementsByClassName("interactable");
            if (interactables.length < 1) return;
            if (this.focus) {
                interactables[0].focus();
            }
        }
    }
}