//  Leopold Hock | 30.04.2020
//  Description: Controller for template "generator".

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class GeneratorController extends Controller {
    @service manager;
    @service database;
    @service generator;

    get characterName() {
        let name = this.model?.character.name;
        if (!name || name === "Anonynmous") {
            return this.manager.localize("route/generator/new-character");
        } else {
            return name;
        }
    }
}