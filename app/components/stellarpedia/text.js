//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// Component for Stellarpedia <txt> element.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class StellarpediaTextComponent extends Component {
    @service manager;
    @service stellarpedia;

    style = "default";

    @action
    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Runs after the component has been rendered. Subscribes to stellarpedia link
        // buttons' onClick events if there are any in the currently displayed article.
        //----------------------------------------------------------------------------//
        let linkButtons = document.getElementsByClassName("button-link");
        for (let button of linkButtons) {
            button.removeEventListener("click", this.stellarpedia.onLinkClick);
            button.addEventListener("click", this.stellarpedia.onLinkClick, false);
        }
    }
}