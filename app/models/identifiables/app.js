import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';

export default class DatabaseAppModel extends DatabasePrefabModel {
    @attr() appCategory;
    @attr() factor;
    @attr() current;
    @attr() min;
    @attr() max;
    @attr() requirements;
}