
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorAttributesController extends Controller {
    @service manager;
    @service database;
    @service generator;

    @action onChange(event, { object, step } = {}) {
        if (object.setLevel(step) !== undefined) {
            this.generator.setAp(-1 * step);
        }
    }
}