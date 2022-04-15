import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class DatabaseGetIdentifiableHelper extends Helper {
    @service database;
    compute([id]) {
        return this.database.getIdentifiable(id);
    }
}