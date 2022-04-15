import StellarpediaArticleIdentifiableComponent from './identifiable';
import { inject as service } from '@ember/service';

export default class StellarpediaArticleOriginComponent extends StellarpediaArticleIdentifiableComponent {
    @service database;

    get attributeBonus() {
        let result = `<link="BasicRules;SupplementPrimaryAttributes;pri-a/ch"><lc>${this.data.specialPA}</lc></link> +${this.database.getIdentifiable("constant/special-pri-a-bonus").value}`;
        result = this.stringToPreparedText(result);
        return result;
    }

    get skillBonuses() {
        let result = "";
        for (let skillFixed of this.data.skillsFixed) {
            result += `<link="BasicRules;SupplementSkills;${skillFixed.id}"><lc>${skillFixed.id}</lc></link> +${skillFixed.level}; `;
        }
        for (let skillOption of this.data.skillOptions) {
            for (let i = 0; i < skillOption.options.length; i++) {
                result += `<link="BasicRules;SupplementSkills;${skillOption.options[i]}"><lc>${skillOption.options[i]}</lc></link>`;
                if (i < skillOption.options.length - 2) {
                    result += ", ";
                } else if (i === skillOption.options.length - 2) {
                    result += " <lc>misc/or</lc> ";
                } else if (i === skillOption.options.length - 1) {
                    result += ` +${skillOption.level}`;
                }
            }
            if (skillOption !== this.data.skillOptions.at(-1)) {
                result += "; ";
            }
        }
        result = this.stringToPreparedText(result);
        return result;
    }
}