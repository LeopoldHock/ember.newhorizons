import Model, { attr } from '@ember-data/model';

export default class BugReportModel extends Model {
    @attr("string") description;
    @attr("string") reproduction;
    @attr("string") applog;
    @attr("string") email;
}