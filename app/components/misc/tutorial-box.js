import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import classic from "ember-classic-decorator";

/**
 * Component for a tutorial box. The tutorial box is used to display useful tips to the user
 * during game-related operations. A tracker object must be provided for the component
 * to know whether it should be display since the user can disable tutorials as well as
 * close individual tutorial boxes.
 * @author Leopold Hock <kontakt@leopoldhock.de>
 * 
 * @param {string} title - The title of the tutorial box.
 * @param {string} text - The text of the tutorial box.
 * @param {Object} tracker - The object on which the tutorial box states should be tracked.
 * @param {string} tutorialId - The id of the tutorial box. Will be used for tracking its state on the tracker.
 */
@classic
export default class TutorialBoxComponent extends Component {
    @tracked closed = false;

    init() {
        super.init();
        if (!this.tracker) {
            throw new Error("A tracker must be supplied to the tutorial box.");
        }
        if (!this.tracker.tutorials) {
            this.tracker.tutorials = { enabled: true, tutorialBoxes: [] };
        }
        let tutorialReference = this.tracker.tutorials.tutorialBoxes.find(element => element.tutorialId === this.tutorialId);
        if (tutorialReference) {
            this.closed = tutorialReference.closed;
            tutorialReference.component = this;
        } else {
            this.closed = !this.tracker.tutorials.enabled;
            this.tracker.tutorials.tutorialBoxes.push({ tutorialId: this.tutorialId, closed: !this.tracker.tutorials.enabled, component: this });
        }
    }


    @action onClose() {
        let that = this;
        // let maxHeight = this.element.firstElementChild.offsetHeight;
        // this.element.firstElementChild.style.maxHeight = maxHeight;
        this.element.firstElementChild.classList.add("tutorial-box-closing");
        setTimeout(function () { that.hide(); }, 500);
    }

    show() {
        this.closed = false;
        this.updateTracker();
    }

    hide() {
        this.closed = true;
        this.updateTracker();
    }

    updateTracker() {
        let savedTutorialBox = this.tracker.tutorials.tutorialBoxes.find(element => element.tutorialId === this.tutorialId);
        if (savedTutorialBox) {
            savedTutorialBox.closed = this.closed;
        }
    }

    get hidden() {
        return this.closed;
    }

    /**
     * Enables all tutorials for the given tracker.
     * @param {Object} tracker - The tracking object.
     */
    static enableAllTutorials(tracker) {
        if (!tracker.tutorials) {
            tracker.tutorials = { enabled: true, tutorialBoxes: [] };
        } else {
            tracker.tutorials.enabled = true;
            for (let tutorialBox of tracker.tutorials.tutorialBoxes) {
                tutorialBox.component.show();
            }
        }
    }

    /**
     * Disables all tutorials for the given tracker.
     * @param {Object} tracker - The tracking object.
     */
    static disableAllTutorials(tracker) {
        if (!tracker.tutorials) {
            tracker.tutorials = { enabled: false, tutorialBoxes: [] };
        } else {
            tracker.tutorials.enabled = false;
            for (let tutorialBox of tracker.tutorials.tutorialBoxes) {
                tutorialBox.component.hide();
            }
        }
    }
}