//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-12
// Description:
// Modal for when an action is illegal due to restrictions being violated.
//----------------------------------------------------------------------------//
import ModalComponent from '../modal';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ModalGameRequirementsMissingComponent extends ModalComponent {
    @tracked identifiable;
    @tracked selectedOption;
    @tracked failedRequirements;
    @tracked requirements = [];

    willRender() {
        super.willRender();
        for (let failedRequirement of this.failedRequirements) {
            let requirement = { failedRequirement: failedRequirement };
            requirement.textLeft = `${this.manager.localize(this.identifiable.id)}`;
            if (this.selectedOption?.id) {
                requirement.textLeft += ` (${this.manager.localize(this.selectedOption.id)})`
            }
            requirement.textRight = `${this.manager.localize(failedRequirement.id)}`;
            if (failedRequirement.input && failedRequirement.level) {
                requirement.textRight += ` (${this.manager.localize(failedRequirement.input)}, ${failedRequirement.level})`;
            } else if (failedRequirement.input) {
                requirement.textRight += ` (${this.manager.localize(failedRequirement.input)})`;
            } else if (failedRequirement.level) {
                requirement.textRight += ` (${failedRequirement.level})`;
            }
            this.requirements.push(requirement);
        }
    }

    @action onYesClick() {
        this.manager.hideModal();
    }
}