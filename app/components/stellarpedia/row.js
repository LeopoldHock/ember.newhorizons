//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// Component for Stellarpedia <row> element.
//----------------------------------------------------------------------------//
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class StellarpediaRowComponent extends Component {
    @service manager;
    @service stellarpedia;
    @tracked rowData = {
        type: "default",
        cells: [],
        width: [],
        alignment: [],
        content: []
    };

    constructor(...args) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-01
        // Description:
        // Reads the input that has been prepared by the Stellarpedia service and
        // tries to turn it into a template- and bootstrap-friendly format.
        //----------------------------------------------------------------------------//
        super(...args);
        let input = this.manager.stellarpedia.prepareRow(this.args.rawInput);
        if (input.isHeader) {
            this.rowData.type = "header";
        } else if (input.isLast) {
            this.rowData.type = "last";
        } else {
            this.rowData.type = "default";
        }
        for (let i = 0; i < input.content.length; i++) {
            let cell = {
                text: htmlSafe(this.manager.stellarpedia.processText(input.content[i]))
            };
            // interpret alignment
            if (input.alignment[i]) {
                if (input.alignment === "c") cell.alignment = "text-center";
                else if (input.alignment === "r") cell.alignment = "text-right";
                else cell.alignment = "text-left";
            } else cell.alignment = "text-left";
            // interpret layout and calulate cell width
            if (input.layout[i]) {
                let cellLayout = input.layout[i];
                let totalLayout = 0;
                for (let otherCellLayout of input.layout) {
                    totalLayout += otherCellLayout;
                }
                if (totalLayout > input.content.length && totalLayout > cellLayout) {
                    cell.width = (cellLayout / totalLayout * 100) + "%";
                } else {
                    cell.width = (1 / input.cells.length * 100) + "%";
                }
            } else {
                cell.width = (1 / input.cells.length * 100) + "%";
            }
            cell.width = htmlSafe("width:" + cell.width);
            this.rowData.cells.push(cell);
        }
    }

    @action didInsert() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Runs after the component has been rendered. Subscribes to stellarpedia link
        // buttons' onClick events if there are any in the currently displayed article.
        //----------------------------------------------------------------------------//
        let linkButtons = document.getElementsByClassName("stellarpedia-link");
        for (let button of linkButtons) {
            button.removeEventListener("click", this.stellarpedia.onLinkClick);
            button.addEventListener("click", this.stellarpedia.onLinkClick, false);
        }
    }
}