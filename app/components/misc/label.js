
import Component from '@glimmer/component';

export default class LabelComponent extends Component {
    get textPosition() {
        return this.args.textPosition ?? "left";
    }
}