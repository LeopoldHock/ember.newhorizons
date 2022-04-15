import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';

export default class StellarpediaSidebarBookComponent extends Component {
    @service manager;
    @service stellarpedia;

    get book() {
        return this.args.book;
    }

    get expanded() {
        return this.args.expanded || false;
    }

    @action onClick() {
        let sidebarData = this.stellarpedia.sidebarData;
        let that = this;
        sidebarData.forEach(function (book) {
            if (book.id === that.book.id) {
                that.stellarpedia.loadIntoSidebarData(book.id);
                set(book, "expanded", !that.expanded);
                return;
            }
        });
    }
}