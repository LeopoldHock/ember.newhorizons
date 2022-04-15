import Component from '@ember/component';
import { tracked, cached } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import classic from 'ember-classic-decorator';

/**
 * This is the prototype for all list components.
 * @param  {Object[]} data - The data that is going to make up the list's rows.
 * @param  {string} sortingKey (optional) - The key by which the table should be sorted by default. 
 * @param  {bool} ascending=true (optional) - Should the table be sorted ascending by default?
 * @param  {string} filterKey (optional) - If this is supplied, the data array will be filtered using this key and filterValue.
 * @param  {string} filterValue (optional) - If this is supplied, the data array will be filtered using filterKey and this value.
 * @param  {bool} filterValueIsId=false (optional) - When filtering, is the filtered value an id and needs to be transformed?
 */
@classic
export default class ListComponent extends Component {
    @service manager;
    @service database;

    @tracked data = [];
    @tracked sortingKey;
    @tracked ascending = true;

    @cached
    get rows() {
        let result = [];
        let data;
        // make sure data is an array
        if (Array.isArray(this.data)) {
            data = this.data;
        } else {
            data = this.data.toArray();
        }
        for (let element of data) {
            let row = {
                data: element,
                changeset: new Changeset(element, { skipValidate: true }),
                localizedLabel: this.manager.localize(element.id)
            };
            result.push(row);
        }
        if (this.sortingKey) {
            if (this.ascending) {
                result = this.manager.sortArray(result, this.sortingKey);
            } else {
                result = this.manager.sortArray(result, "-" + this.sortingKey);
            }
        }
        return result;
    }

    @action sortByProperty(property) {
        if (property == this.sortingKey) {
            // If the table is currently sorted by that key, just switch sorting direction
            this.set("ascending", !this.ascending);
        } else {
            // Else, sort ascending by the new sorting key
            this.set("sortingKey", property);
            this.set("ascending", true);
        }
    }
}