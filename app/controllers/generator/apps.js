
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorAppsController extends Controller {
    @service manager;
    @service database;
    @service generator;

    @tracked changeset = Changeset({});

    init() {
        super.init();
    }
}