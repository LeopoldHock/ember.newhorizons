import DatabaseIdentifiableModel from './identifiable';
import { attr } from '@ember-data/model';

export default class DatabaseAppCategoryModel extends DatabaseIdentifiableModel {
    @attr() baseSkill;
}