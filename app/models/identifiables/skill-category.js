import DatabaseIdentifiableModel from './identifiable';
import { attr } from '@ember-data/model';

export default class DatabaseSkillCategoryModel extends DatabaseIdentifiableModel {
    @attr() available;
    @attr() total;
    @attr() min;
    @attr() max;
    @attr() numberOfSkills;
    @attr() maxNumberOfSkills;
}