import DatabaseIdentifiableModel from './identifiable';
import { attr } from '@ember-data/model';

export default class DatabaseWeightModifierModel extends DatabaseIdentifiableModel {
    @attr() value;
}