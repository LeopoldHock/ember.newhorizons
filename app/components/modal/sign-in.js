//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Modal::Bug-Report component.
//----------------------------------------------------------------------------//
import ModalComponent from './modal';
import { inject as service } from '@ember/service';

export default class ModalBugReportComponent extends ModalComponent {
    @service modalService;
}