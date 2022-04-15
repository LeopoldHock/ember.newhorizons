import Model, { attr } from '@ember-data/model';

export default class StellarpediaModel extends Model {
    @attr() faIcon;
    @attr() chapters;
}