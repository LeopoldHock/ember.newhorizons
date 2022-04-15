import Controller from '@ember/controller';
import { action, get, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
    @service manager;
    @service session;
    @service modalService;
    @service messageService;

    @tracked sidebarIconSize = "1";
    @tracked leftSidebarExpanded = false;
    @tracked rightSidebarExpanded = false;

    @action toggleSidebar(id) {
        let isExpanded = get(this, id + "Expanded");
        if (isExpanded) {
            this._closeSidebar(id);
        } else {
            this._openSidebar(id);
        }
    }

    @action closeSidebars() {
        this._closeSidebar("leftSidebar");
        this._closeSidebar("rightSidebar");
    }

    _closeSidebar(id) {
        document.getElementById(id).style.width = null;
        if (id == "leftSidebar") {
            document.getElementById("pageOutletContainer").style.marginLeft = "0px";
        }
        else if (id == "rightSidebar") {
            document.getElementById("pageOutletContainer").style.marginRight = "0px";
        }
        set(this, id + "Expanded", false);
    }

    _openSidebar(id) {
        let expandedWidth = "300px";
        let reduceBy = "300px";
        document.getElementById(id).style.width = expandedWidth;
        if (this.manager.isDesktop) {
            if (id == "leftSidebar") {
                document.getElementById("pageOutletContainer").style.marginLeft = reduceBy;
            }
            else if (id == "rightSidebar") {
                document.getElementById("pageOutletContainer").style.marginRight = reduceBy;
            }
        } else {
            if (this.rightSidebarExpanded) {
                document.getElementById("rightSidebar").style.width = null;
                this.rightSidebarExpanded = false;
            }
            if (this.leftSidebarExpanded) {
                document.getElementById("leftSidebar").style.width = null;
                this.leftSidebarExpanded = false;
            }
        }
        set(this, id + "Expanded", true);
    }
}