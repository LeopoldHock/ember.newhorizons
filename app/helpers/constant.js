//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-17
// Description:
// This helper returns a specific constant.
//----------------------------------------------------------------------------//
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class LocalizeHelper extends Helper {
    @service database;

    compute([id]) {
        if (id) {
            return this.database.getConstant(id);
        }
    }
}