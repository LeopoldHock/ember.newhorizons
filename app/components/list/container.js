import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ListContainerComponent extends Component {
    @service manager;

    get size() {
        return this.args.size ?? "medium";
    }
}