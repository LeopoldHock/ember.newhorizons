import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';

export default class DatabaseItemModel extends DatabasePrefabModel {
    @attr() guid;
    @attr() name;
    @attr() itemCategory;
    @attr() itemType;
    @attr() value;
    @attr() weight;
    @attr() carriedWhere;
    @attr() weightModifier;
    @attr() isCustom;
    @attr() durability;
    @attr() weaponMelee;
    @attr() weaponRanged;
    @attr() ammo;
    @attr() weaponMod;
    @attr() armor;
    @attr() implant;
    @attr() isStackable;
    @attr() amount;
    @attr() uses;
    @attr() maxUses;
    @attr() valuePerWeight;
}