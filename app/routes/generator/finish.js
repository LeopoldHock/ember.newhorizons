import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MainGeneratorFinishRoute extends Route {
    @service manager;
    @service generator;
    @service database;

}
