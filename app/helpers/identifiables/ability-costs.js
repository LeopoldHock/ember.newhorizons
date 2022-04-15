/**
 * Helper to return and properly display an ability's costs.
 * @author Leopold Hock <kontakt@leopoldhock.de>
 */
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class AbilityCostsHelper extends Helper {
    @service database;

    compute([ability, isGenerator = false]) {
        if (ability) {
            return this.database.calculateAbilityCosts(ability, { useGp: isGenerator });
        }
    }
}