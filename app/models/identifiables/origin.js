import DatabaseIdentifiableModel from './identifiable';
import { attr } from '@ember-data/model';

export default class DatabaseOriginModel extends DatabaseIdentifiableModel {
    @attr() convenientTraits;
    @attr() specialPA;
    @attr() skillsFixed;
    @attr() skillOptions;
}