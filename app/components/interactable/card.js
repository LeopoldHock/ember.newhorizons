
import InteractableComponent from './interactable';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class CardComponent extends InteractableComponent {
    @service manager;

    @action onClick() {
        if (this.url) {
            window.open(this.url);
        } else if (this.route) {
            this.manager.goToRoute(this.route, { model: this.model });
        }
    }
}