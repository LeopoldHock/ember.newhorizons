//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description: This is the central service for the entire application. The manager supplies the magnitude of utility
// functions this are not part of another independent service.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import ENV from 'new-horizons/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import MessageService from './message-service';

export default class ManagerService extends Service {
    @service store;
    @service("constantService") constants;
    @service localization;
    @service messageService;
    @service database;
    @service stellarpedia;
    @service router;
    @service modalService;
    @service session;
    @service generator;

    // Input patterns
    @tracked pattern = {
        email: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",
        password: "^[a-zA-Z0-9!@#$%&*()-+=^]{8,40}$",
        numeric: "^\\d{1,}$",
        any: "(.|\\s)*\\S(.|\\s)*"
    };

    // System Variables
    @tracked devMode = false;
    @tracked isDesktop = false;
    @tracked appVersion = "0.98";

    constructor(...args) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super(...args);
        if (ENV.environment === "development") this.devMode = true;
        this.log("Manager initialized.");
        // listen to media query event to keep isDesktop property updated
        let mediaQuery = window.matchMedia("(min-width: 768px)");
        this.onMediaChange(mediaQuery);
        mediaQuery.addListener(this.onMediaChange);
        // listen to the beforeUnload event to check whether the user risks any data loss
        window.addEventListener("beforeunload", this.onWindowBeforeUnload.bind(this));
    }

    /**
     * Transitions to a given route.
     * @param {string} id - The target route id. 
     * @param {Object} model (optional) - The model parameters for the target route.
     * @param {boolean} closeSidebarsOnMobile=true (optional) - Should the sidebars be closed on mobile devices?
     */
    @action goToRoute(id, { model, closeSidebarsOnMobile = true } = {}) {
        let targetRoute = id;
        if (!id.startsWith("")) {
            targetRoute = targetRoute = "" + id;
        }
        if (model) {
            this.router.transitionTo(targetRoute, model);
        } else {
            this.router.transitionTo(targetRoute);
        }
        if (closeSidebarsOnMobile && !this.isDesktop) {
            let applicationController = getOwner(this).lookup("controller:application");
            applicationController.closeSidebars();
        }
    }

    @action localize(key, allowUndefined = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Sends the input to the localization and returns its value.
        //----------------------------------------------------------------------------//
        return (this.localization.getValue(key, allowUndefined));
    }

    @action log(messageText, messageType = MessageService.messageType.information) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls messageService to log a specific message.
        //----------------------------------------------------------------------------//
        this.messageService.logMessage(messageText, messageType);
    }

    /**
     * Navigates to a given stellarpedia article.
     * @param {string} bookId - The book id.
     * @param {string} chapterId - The chapter id.
     * @param {string} entryId - The entry id.
     * @param {boolean} updateScrollPosition=false - Should the sidebar scroll position be updated?
     * @param {boolean} closeSidebarsOnMobile=true - Should the sidebars be closed on mobile devices?
     */
    @action showStellarpediaEntry(bookId, chapterId, entryId, { updateScrollPosition = false, closeSidebarsOnMobile = true } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls stellarpedia to show a specific Stellarpedia article.
        //----------------------------------------------------------------------------//
        const model = this.database.transformId(bookId) + "+" + this.database.transformId(chapterId) + "+" + this.database.transformId(entryId);
        console.log(model);
        this.goToRoute("stellarpedia", {
            model,
            closeSidebarsOnMobile: closeSidebarsOnMobile
        });
        if (updateScrollPosition) {
            this.stellarpedia.setSidebarFocusToSelectedEntry();
        }
    }

    @action onMediaChange(mediaQuery) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-09
        // Description:
        // Is being triggered on media screen width change. Sets isDesktop property.
        //----------------------------------------------------------------------------//
        this.isDesktop = mediaQuery.matches;
    }

    @action tryCloseSidebar(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hockh / 2020-09-11
        // Description:
        // This method tries to close the specified sidebar.
        //----------------------------------------------------------------------------//
        let applicationController = getOwner(this).lookup("controller:application");
        if (id === "rightSidebar") {
            if (applicationController.rightSidebarExpanded) applicationController.toggleSidebar("rightSidebar");
        } else {
            if (applicationController.leftSidebarExpanded) applicationController.toggleSidebar("leftSidebar");
        }
    }

    @action callModal(type, args, listeners) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-19
        // Description:
        // Renders a specified modal.
        //----------------------------------------------------------------------------//
        this.modalService.render(type, args, listeners);
    }

    @action hideModal() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-19
        // Description:
        // Hides the currently active modal.
        //----------------------------------------------------------------------------//
        this.modalService.hide();
    }

    @action isNullOrWhitespace(input) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-01-20
        // Description:
        // Checks whether the input value is undefined, null, empty or contains
        // only whitespaces.
        //----------------------------------------------------------------------------//
        if (typeof input === 'undefined' || input == null) return true;
        return input.replace(/\s/g, '').length < 1;
    }

    @action getUrlParameters(url) {
        let result = [];
        let urlSplit = url.split("?");
        if (urlSplit[1]) {
            let parameterStrings = urlSplit[1].split("&");
            for (let parameterString of parameterStrings) {
                let parameterSplit = parameterString.split("=");
                if (parameterSplit.length === 2) {
                    result.push({ key: parameterSplit[0], value: parameterSplit[1] });
                }
            }
        }
        return result;
    }

    @action goToSignIn(type = "modal") {
        if (type === "modal" && this.router.currentRouteName !== "sign-in") {
            this.callModal("sign-in");
        } else {
            this.goToRoute("sign-in");
        }
    }

    @action clone(object, id = undefined) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-06
        // Description:
        // Clones a JavaScript object by using JSON.parse(JSON.stringify). Used for
        // cloning database records e.g. during character initialization, when a skill
        // is being added or similar processes. Prevents pass-by-reference.
        //----------------------------------------------------------------------------//
        let result;
        if (object) {
            result = JSON.parse(JSON.stringify(object));
            if (id && result.id === undefined) {
                result = { "id": id, ...result };
            }
        }
        return result;
    }

    onWindowBeforeUnload(event) {
        if (this.devMode) {
            // disable unload warning in dev mode to allow liverelead
            return undefined;
        }
        let isDirty = (this.generator.get("generationInProcess"));
        if (isDirty) {
            let confirmationMessage = this.localize("Misc_BeforeUnloadConfirmMessage");
            (event || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage;
        } else {
            return undefined;
        }
    }

    tryParseInt(input) {
        try {
            if (typeof parseInt(input) === "number" && !isNaN(parseInt(input))) {
                return parseInt(input);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    sortArray(array, ...args) {
        let props = args;
        let that = this;
        let dynamicSort = function dynamicSort(property, isNestedProperty) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                let propertyA = a[property];
                let propertyB = b[property];
                if (isNestedProperty) {
                    propertyA = that.getNestedProperty(a, property);
                    propertyB = that.getNestedProperty(b, property);
                }
                var result = (propertyA < propertyB) ? -1 : (propertyA > propertyB) ? 1 : 0;
                return result * sortOrder;
            };
        };
        if (array?.length > 1) {
            array.sort(function (obj1, obj2) {
                var i = 0, result = 0, numberOfProperties = props.length;
                while (result === 0 && i < numberOfProperties) {
                    let isNestedProperty = props[i].includes(".");
                    result = dynamicSort(props[i], isNestedProperty)(obj1, obj2);
                    i++;
                }
                return result;
            });
        }
        return array;
    }

    getNestedProperty(object, propertyPath) {
        if (propertyPath.includes(".")) {
            let properties = propertyPath.split(".");
            let result = undefined;
            for (let property of properties) {
                let candidate = object[property];
                if (Array.isArray(candidate)) {
                    // not yet supported
                } else if (typeof candidate === "object") {
                    object = candidate;
                } else {
                    result = candidate;
                    break;
                }
            }
            return result;
        } else {
            return object[propertyPath];
        }
    }
}