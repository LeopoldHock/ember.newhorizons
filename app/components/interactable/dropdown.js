//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Dropdown'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @tracked selectedItem;
    @tracked firstItem;
    @tracked lastItem;
    isInitialized = false;
    loop = true;
    @tracked disabled = false;
    @tracked items;
    localizeId = true;

    didRender() {
        if (!this.isInitialized) {
            let items = this.items.content || this.items;
            if (this.defaultItem) {
                this.selectItem(this.defaultItem);
            } else {
                this.selectItem(items[0]);
            }
            this.isInitialized = true;
        }
    }

    get isDisabled() {
        let items = this.items.content || this.items;
        if (!items || items.length === 0) {
            return true;
        } else {
            return this.disabled;
        }
    }

    get caption() {
        let items = this.items.content || this.items;
        if (!items || items.length === 0) {
            return this.manager.localize("Misc_NoData");
        } else {
            this.firstItem = items[0];
            this.lastItem = items[items.length - 1];
            if (this.selectedItem?.id || this.selectedItem?.label) {
                if (this.localizeId) {
                    return this.manager.localize(this.selectedItem.id);
                } else {
                    return this.selectedItem.label;
                }
            } else {
                return "";
            }
        }
    }

    @action selectItem(item) {
        // do dropdown specific stuff
        this.selectedItem = item;
        // try to call onChange(itemID)
        if (typeof this.onChangeListener === this.manager.constants.typeOfFunction) {
            this.onChangeListener(item, this);
        }
    }

    // internal event that handles dropdown selection
    @action onItemClicked(item) {
        if (this.isDisabled) return;
        this.selectItem(item);
    }

    @action onPreviousClick() {
        this.selectNextItem(false);
    }

    @action onNextClick() {
        this.selectNextItem(true);
    }

    // Select next dropdown item
    @action selectNextItem(forward = true) {
        let items = this.items.content || this.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === this.selectedItem.id) {
                let newIndex;
                // Select next or previous item
                if (forward) {
                    newIndex = i + 1;
                } else {
                    newIndex = i - 1;
                }
                // Check if index is valid
                if (newIndex < 0 || newIndex >= items.length) {
                    // If it isn't, select first or final item depending on 'loop' parameter
                    if (this.loop) {
                        if (newIndex < 0) {
                            newIndex = items.length - 1;
                        } else {
                            newIndex = 0;
                        }
                    } else {
                        if (newIndex < 0) {
                            newIndex = 0;
                        } else {
                            newIndex = items.length - 1;
                        }
                    }
                }
                this.selectItem(items[newIndex]);
                break;
            }
        }
    }
}