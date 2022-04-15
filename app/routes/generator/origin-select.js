import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class MainGeneratorOriginSelectRoute extends Route {
    @service manager;
    @service generator;
    @service database;
    @service stellarpedia;

    async model(params) {
        if (this.generator.originChosen) {
            this.transitionTo("generator.origin");
        }
        let reduced_origin_id = params.reduced_origin_id;
        if (!reduced_origin_id) {
            this.transitionTo("generator.origin");
        }
        await this.stellarpedia.load();
        await this.database.loadCollection("origin");
        let origin = this.database.getIdentifiable("origin/" + reduced_origin_id);
        if (!origin) {
            this.transitionTo("generator.origin");
        }
        // make radio-compatible 'options' arrays for all skill choices
        let skillRadioData = [];
        for (let i = 0; i < origin.skillOptions.length; i++) {
            let skillRadioItem = {
                radioName: "skill-option-" + i,
                level: origin.skillOptions[i].level,
                options: []
            };
            for (let skill of origin.skillOptions[i].options) {
                skillRadioItem.options.push({
                    caption: this.manager.localize(skill) + " +" + skillRadioItem.level,
                    value: skill
                });
            }
            skillRadioData.push(skillRadioItem);
        }
        return RSVP.hash({
            data: {
                motherTongue: "Solaire",
                origin: origin,
                skillOptions: skillRadioData
            },
            skills: this.database.loadCollection("skill"),
            abilities: this.database.loadCollection("ability")
        });
    }
}
