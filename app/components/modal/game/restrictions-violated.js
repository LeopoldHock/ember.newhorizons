//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-12
// Description:
// Modal for when an action is illegal due to restrictions being violated.
//----------------------------------------------------------------------------//
import ModalComponent from '../modal';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ModalGameRestrictionsViolatedConfirmComponent extends ModalComponent {
    @tracked identifiable;
    @tracked selectedOption;
    @tracked violatedRestrictions;
    @tracked violations = [];

    willRender() {
        super.willRender();
        for (let violatedRestriction of this.violatedRestrictions) {
            let violation = { violatedRestriction: violatedRestriction };
            violation.textLeft = `${this.manager.localize(this.identifiable.id)}`;
            if (this.selectedOption?.id) {
                violation.textLeft += ` (${this.manager.localize(this.selectedOption.id)})`
            }
            violation.textRight = `${this.manager.localize(violatedRestriction.id)}`;
            if (violatedRestriction.input && violatedRestriction.level) {
                violation.textRight += ` (${this.manager.localize(violatedRestriction.input)}, ${violatedRestriction.level})`;
            } else if (violatedRestriction.input) {
                violation.textRight += ` (${this.manager.localize(violatedRestriction.input)})`;
            } else if (violatedRestriction.level) {
                violation.textRight += ` (${violatedRestriction.level})`;
            }
            this.violations.push(violation);
        }
    }

    @action onYesClick() {
        this.manager.hideModal();
    }
}