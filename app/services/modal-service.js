import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ModalService extends Service {
    @service manager;
    @tracked isActive = false;
    @tracked componentName = "modal/confirm";
    @tracked args = [];
    @tracked listeners = [];

    @action render(type, args = [], listeners = []) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-23
        // Description:
        // Generic method to render any modal and set it to be the active modal.
        //----------------------------------------------------------------------------//
        let that = this;
        let modalContainer = document.getElementById("modal-container");
        if (modalContainer) {
            this.componentName = "modal/" + type;
            // Read arguments (can be object or array) or default to an empty array
            this.args = [];
            if (Array.isArray(args)) {
                this.args = args;
            } else {
                if (typeof args === 'object') {
                    let propertyNames = Object.getOwnPropertyNames(args);
                    for (let propertyName of propertyNames) {
                        this.args.push({ "name": propertyName, "value": args[propertyName] });
                    }
                }
            }
            this.listeners = listeners;
            // show modal container and update state
            modalContainer.style.display = "flex";
            that.isActive = true;
        }
    }

    @action hide() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-23
        // Description:
        // Generic method to hide any modal and clear modal-specific memory.
        //----------------------------------------------------------------------------//
        let modalContainer = document.getElementById("modal-container");
        modalContainer.style.display = "none";
        this.componentName = "modal/confirm";
        this.args = [];
        this.listeners = [];
        this.isActive = false;
    }
}