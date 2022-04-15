//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-24
// Description:
// Parent class for all interactable UI components.
//----------------------------------------------------------------------------//

import Component from '@glimmer/component';

export default class TitleComponent extends Component {
    get textPosition() {
        return this.args.textPosition ?? "left";
    }

    get fontColor() {
        return this.args.fontColor ?? "white";
    }
}