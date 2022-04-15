import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';

@classic
export default class StellarpediaSidebarEntryComponent extends Component {
    @service manager;
    @service stellarpedia;

    get book() {
        return this.args.book;
    }

    get chapter() {
        return this.args.chapter;
    }

    get entry() {
        return this.args.entry;
    }

    get selected() {
        return this.args.selected ?? false;
    }

    get highlighted() {
        let that = this;
        for (let book of this.stellarpedia.sidebarData) {
            for (let chapter of book.chapters) {
                chapter.entries.forEach(function (entry) {
                    if (entry.selected && entry.path !== that.entry.path) {
                        set(entry, "selected", false);
                    }
                });
            }
        }
        return this.selected;
    }

    @action onClick() {
        this.manager.showStellarpediaEntry(this.book.id, this.chapter.id, this.entry.id);
    }

    @action didInsert() {
        if (this.selected) {
            this.stellarpedia.setSidebarFocusToSelectedEntry();
        }
    }
}