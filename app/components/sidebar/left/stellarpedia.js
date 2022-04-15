import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SidebarLeftStellarpediaComponent extends Component {
    @service manager;
    @service stellarpedia;

    @action returnToPrevious() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Returns to previous menu.
        //----------------------------------------------------------------------------//
        this.manager.goToRoute(this.manager.stellarpedia.returnRoute, { closeSidebarsOnMobile: false });
    }

    @action onReduceAllClick() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Reduces all collapsed sidebar-groups.
        //----------------------------------------------------------------------------//
        for (let book of this.stellarpedia.sidebarData) {
            if (book.expanded) {
                set(book, "expanded", false);
            }
            for (let chapter of book.chapters) {
                if (chapter.expanded) {
                    set(chapter, "expanded", false);
                }
            }
        }
    }
}