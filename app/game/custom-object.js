import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default class CustomObject {
    @service manager;

    constructor({ context } = {}) {
        if (!context || !getOwner(context)) {
            throw "Instantiation of custom object failed because no application context was supplied.";
        }
        setOwner(this, getOwner(context));
    }
}