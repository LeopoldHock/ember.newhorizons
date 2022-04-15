import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import MessageService from 'new-horizons/services/message-service';

export default class SidebarLeftMainComponent extends Component {
    @service manager;

    @action goToTab(id) {
        this.manager.goToRoute(id);
    }

    @action goToStellarpedia() {
        this.manager.showStellarpediaEntry("basic-rules", "introduction", "welcome", { updateScrollPosition: true, closeSidebarsOnMobile: false });
    }

    @action goToDiscord() {
        window.open("https://discord.gg/anSjdatqby");
    }

    @action updateTabGroup(buttonGroupID, selectedID, classNameSelected) {
        let buttonGroup = document.getElementById(buttonGroupID);
        if (!buttonGroup) {
            this.manager.log("Unable to find control '" + buttonGroupID + "'.", MessageService.messageType.exception);
            return;
        } else if (!document.getElementById(selectedID)) {
            this.manager.log("Unable to find control '" + selectedID + "'.", MessageService.messageType.exception);
            return;
        }
        for (let i = 0; i < buttonGroup.children.length; i++) {
            buttonGroup.children[i].classList.remove(classNameSelected);
        }
        document.getElementById(selectedID).classList.add(classNameSelected);
    }
}