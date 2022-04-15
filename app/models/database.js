import Model, { attr } from '@ember-data/model';

export default class DatabaseModel extends Model {
    @attr() entries;
}