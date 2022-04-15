// Leopold Hock | 30.04.2020
// Description: The localization manages the current localization and supplies localized values for keys.
// Changes:
// Leopold Hock | 17.06.2020 | Implemented ember-data. Localization now stored in localization model.

import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class LocalizationService extends Service {
    @service database;
    @service intl;

    constructor(...args) {
        super(...args);
        this.intl.setLocale("de");
    }

    getValue(key, allowUndefined = false) {
        if (key.string) key = key.string;
        key = this.database.transformId(key);
        let intlKey = key.replaceAll("/", ".");
        if (this.intl.lookup(intlKey)) {
            return this.intl.t(intlKey);
        } else {
            if (allowUndefined) {
                return undefined;
            }
            else {
                this.intl.t(intlKey);
                return ("loc-miss::" + key);
            }
        }
    }

    getCurrentLocale() {
        return this.intl.locale[0];
    }
}