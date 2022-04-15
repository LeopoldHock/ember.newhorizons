import Model, { attr } from '@ember-data/model';

export default class ApplogModel extends Model {
    @attr("string") createdAt;
    @attr("string") type;
    @attr("string") text;

    toJSON() {
        return this.serialize();
    }
}