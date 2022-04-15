import StellarpediaArticleIdentifiableComponent from './identifiable';
import { inject as service } from '@ember/service';

export default class StellarpediaArticleSecondaryAttributeComponent extends StellarpediaArticleIdentifiableComponent {
    @service database;

    get header() {
        return this.manager.localize(this.data.id + "");
    }
}