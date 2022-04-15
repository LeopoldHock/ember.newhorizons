/**
 * Helper to determine the correct navigation sidebar component for the particular template.
 * @author Leopold Hock <kontakt@leopoldhock.de>
 */
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class GetSidebarHelper extends Helper {
    @service router;

    compute([right]) {
        let sidebarUri;
        if (right) {
            sidebarUri = "sidebar/right/";
        } else {
            sidebarUri = "sidebar/left/";
        }
        let result = sidebarUri + "main";
        let routeName = this.router.currentRouteName;
        if (!routeName) return;
        let routeNameSplit = routeName.split(".") || [routeName];
        for (let i = routeNameSplit.length - 1; i >= 0; i--) {
            let fullRouteName = "";
            for (let ii = 0; ii <= i; ii++) {
                fullRouteName += routeNameSplit[ii];
                if (ii < i) fullRouteName += ".";
            }
            let componentUri = sidebarUri + fullRouteName.replaceAll(".", "/");
            // check whether this route has an own navbar template
            let sidebarComponent = getOwner(this).lookup("component:" + componentUri);
            if (sidebarComponent) {
                result = componentUri;
                break;
            }
        }
        return result;
    }
}