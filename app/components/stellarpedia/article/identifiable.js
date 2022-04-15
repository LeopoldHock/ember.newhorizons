import StellarpediaArticleComponent from '../article';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StellarpediaArticleIdentifiableComponent extends StellarpediaArticleComponent {
    @service manager;
    @service stellarpedia;
    @service database;


    get entry() {
        return this.args.entry;
    }

    get data() {
        return this.database.getIdentifiable(this.entry.id);
    }

    get header() {
        return this.manager.localize(this.data.id);
    }

    get image() {
        return this.getElementByTag("img");
    }

    get text() {
        return this.getElementByTag("txt");
    }
}