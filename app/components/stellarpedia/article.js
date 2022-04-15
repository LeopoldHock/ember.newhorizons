import Component from '@glimmer/component';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class StellarpediaArticleComponent extends Component {
    @service manager;
    @service stellarpedia;

    get entry() {
        return this.args.entry;
    }

    get titleAlignment() {
        return this.args.titleAlignment ?? "left";
    }

    /**
     * Returns the (first) entry's element that matches the given tag.
     * @param {string} tag - The element tag.
     * @param {bool} prepare (optional) - Should the result be prepared for display?
     * @returns {string} - Returns the first element string or undefined.
     */
    getElementByTag(tag) {
        let result;
        for (let element of this.entry.elements) {
            if (this.stellarpedia.getElementType(element) === tag) {
                result = element;
                break;
            }
        }
        return result;
    }

    /**
     * Returns an array of all elements that match the given tag.
     * @param {string} tag - The element tag.
     * @param {bool} prepare (optional) - Should the result be prepared for display?
     * @returns {string[]} - The array with the matching elements.
     */
    getElementsByTag(tag) {
        let result = [];
        for (let element of this.entry.elements) {
            if (this.stellarpedia.getElementType(element) === tag) {
                result.push(element);
            }
        }
        return result;
    }

    /**
     * Parses a string to a 'detail' text prepared for display by Stellarpedia components.
     * @param {string} input - The input string.
     * @returns {string} - The parsed string.
     */
    stringToPreparedText(input) {
        let result = "[txt]" + input;
        result = this.stellarpedia.prepareText(result);
        result = htmlSafe(result);
        return result;
    }

    /**
     * Localizes an input.
     * @param {string} input - The localization key.
     * @returns {string} - The localized value.
     */
    localize(input) {
        return this.manager.localize(input);
    }
}