import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import classic from 'ember-classic-decorator';

@classic
export default class StellarpediaSidebarChapterComponent extends Component {
    @service manager;
    @service stellarpedia;

    get book() {
        return this.args.book;
    }

    get chapter() {
        return this.args.chapter;
    }

    get expanded() {
        return this.args.expanded ?? false;
    }

    @action onClick() {
        let sidebarData = this.stellarpedia.sidebarData;
        let that = this;
        for (let book of sidebarData.toArray()) {
            if (book.id === that.book.id) {
                book.chapters.forEach(function (chapter) {
                    if (chapter.id === that.chapter.id) {
                        that.stellarpedia.loadIntoSidebarData(book.id, chapter.id);
                        set(chapter, "expanded", !that.expanded);
                        return;
                    }
                });
            }
        }
    }
}