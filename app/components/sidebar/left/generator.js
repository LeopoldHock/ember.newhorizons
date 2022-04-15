import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SidebarLeftGeneratorComponent extends Component {
    @service manager;
    @service generator;
    tabs = [{ id: "personal", icon: "circle-user", routeName: "generator.personal" },
    { id: "attributes", icon: "person-running", routeName: "generator.attributes" },
    { id: "traits", icon: "yin-yang", routeName: "generator.traits" },
    { id: "skills", icon: "person-biking", routeName: "generator.skills" },
    { id: "abilities", icon: "book-open", routeName: "generator.abilities" },
    { id: "apps", icon: "mobile-screen", routeName: "generator.apps" },
    { id: "inventory", icon: "suitcase", routeName: "generator.inventory" },
    { id: "finish", icon: "list-check", routeName: "generator.finish" },
    ];

    @action
    returnToMenu() {
        this.manager.goToRoute("home", { closeSidebarsOnMobile: false });
    }

    @action
    goToTab(id) {
        this.manager.goToRoute("generator." + id);
    }
}