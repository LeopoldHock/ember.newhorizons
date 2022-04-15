//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-23
// Description:
// Transforms an id and returns the result.
//----------------------------------------------------------------------------//

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class LocalizeHelper extends Helper {
    @service database;
    compute([id]) {
        return this.database.transformId(id);
    }
}