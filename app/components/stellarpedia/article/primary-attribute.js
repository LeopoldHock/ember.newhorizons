import StellarpediaArticleIdentifiableComponent from './identifiable';
import { inject as service } from '@ember/service';

export default class StellarpediaArticlePrimaryAttributeComponent extends StellarpediaArticleIdentifiableComponent {
    @service database;

    get header() {
        return this.manager.localize(this.data.id + "");
    }

    get factor() {
        return this.database.getIdentifiable("constant/pri-a-factor").value;
    }

    get usedInSecondaryAttributes() {
        let result = "";
        for (let secondaryAttribute of this.database.getCollection("sec-a").toArray()) {
            if (secondaryAttribute.primaryAttributes.find(element => element === this.data.id)) {
                result += `<link="BasicRules;SupplementSecondaryAttributes;${secondaryAttribute.id}"><lc>${secondaryAttribute.id}</lc></link>; `;
            }
        }
        if (result) {
            result = "[txt]" + result.slice(0, -2);
        }
        return result;
    }

    get usedInSkills() {
        let result = "";
        for (let skill of this.database.getCollection("skill").toArray()) {
            if (skill.primaryAttributes.find(element => element === this.data.id)) {
                result += `<link="BasicRules;SupplementSkills;${skill.id}"><lc>${skill.id}</lc></link>; `;
            }
        }
        if (result) {
            result = "[txt]" + result.slice(0, -2);
        }
        return result;
    }
}