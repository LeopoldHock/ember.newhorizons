import StellarpediaArticleIdentifiableComponent from './identifiable';
import { inject as service } from '@ember/service';

export default class StellarpediaArticleTraitComponent extends StellarpediaArticleIdentifiableComponent {
    @service database;
    @service manager;

    get cost() {
        return Math.abs(this.data.costs) + " " + this.manager.localize("stellarpedia/article/trait/gp");
    }

    get options() {
        let result = "";
        if (this.data.hasOptions) {
            result += "[txt]";
            for (let i = 0; i < this.data.options.length; i++) {
                result += `<lc>${this.data.options[i].id}</lc>`;
                if (i < this.data.options.length - 2) {
                    result += ", ";
                } else if (i === this.data.options.length - 2) {
                    result += " <lc>misc/or</lc> ";
                }
            }
        }
        return result;
    }
}