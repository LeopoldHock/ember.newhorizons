//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-17
// Description:
// Helper that returns the costs for buying a trait or increasing its level.
//----------------------------------------------------------------------------//
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class TraitCostsHelper extends Helper {
    @service database;

    compute([trait]) {
        let costs = this.database.calculateTraitCosts(trait);
        if (costs <= 0) {
            return "+" + -costs;
        } else {
            return "-" + costs;
        }
    }
}