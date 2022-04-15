//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-17
// Description:
// Helper that returns the costs for buying a skill or increasing its level.
//----------------------------------------------------------------------------//
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class SkillCostsHelper extends Helper {
    @service database;

    compute([skill, isOwned = false, isGenerator = false]) {
        if (skill) {
            return this.database.calculateSkillCosts(skill.level + 1, skill.factor, { buy: !isOwned, useInterestPoints: isGenerator });
        }
    }
}