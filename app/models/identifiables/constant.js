import DatabaseIdentifiableModel from './identifiable';
import { attr } from '@ember-data/model';

export default class DatabaseConstantModel extends DatabaseIdentifiableModel {
    @attr() value;
}