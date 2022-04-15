import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ListColumnHeaderComponent extends Component {
    @service manager;

    maxTriesLookingForParent = 10; // prevents infinite loop when searching for table

    get sortable() {
        return this.args.sortable ?? false;
    }

    get ascending() {
        return this.args.ascending ?? true;
    }

    get sort() {
        return this.args.sort ?? undefined;
    }

    @action onSortClick() {
        if (this.sort) {
            this.sort(this.sortingKey);
        }

        // // Find header division
        // let parent = event.srcElement.parentElement;
        // for (let i = 0; i < this.maxTriesLookingForParent; i++) {
        //     if (parent.nodeName === "TH") {
        //         break;
        //     } else {
        //         parent = parent.parentElement;
        //     }
        // }
        // if (parent.nodeName !== "TH") return;
        // let th = parent;

        // // find header row
        // for (let i = 0; i < this.maxTriesLookingForParent; i++) {
        //     if (parent.nodeName === "TR") {
        //         break;
        //     } else {
        //         parent = parent.parentElement;
        //     }
        // }
        // if (parent.nodeName !== "TR") return;
        // let tr = parent;

        // // Find table
        // for (let i = 0; i < this.maxTriesLookingForParent; i++) {
        //     if (parent.nodeName === "TABLE") {
        //         break;
        //     } else {
        //         parent = parent.parentElement;
        //     }
        // }
        // if (parent.nodeName !== "TABLE") return;
        // let table = parent;

        // // find out this columns position
        // let n;
        // for (let i = 0; i < tr.children.length; i++) {
        //     if (tr.children[i] === th) {
        //         n = i;
        //         break;
        //     }
        // }
        // if (n === undefined) return;

        // // Do the sorting
        // let rows = table.rows;
        // let dir = "asc";
        // let switching = true;
        // let shouldSwitch = false;
        // let switchcount = 0;
        // /* Make a loop that will continue until
        // no switching has been done: */
        // while (switching) {
        //     // Start by saying: no switching is done:
        //     switching = false;
        //     /* Loop through all table rows (except the
        //     first, which contains table headers): */
        //     let i;
        //     for (i = 1; i < (rows.length - 1); i++) {
        //         // Start by saying there should be no switching:
        //         shouldSwitch = false;
        //         /* Get the two elements you want to compare,
        //         one from current row and one from the next: */
        //         let x = rows[i].getElementsByTagName("TD")[n];
        //         let y = rows[i + 1].getElementsByTagName("TD")[n];
        //         if (dir === "asc") {
        //             if (this.manager.tryParseInt(x.innerHTML) && this.manager.tryParseInt(y.innerHTML)) {
        //                 if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
        //                     shouldSwitch = true;
        //                     break;
        //                 }
        //             } else {
        //                 if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //                     // If so, mark as a switch and break the loop:
        //                     shouldSwitch = true;
        //                     break;
        //                 }
        //             }

        //         } else if (dir === "desc") {
        //             if (this.manager.tryParseInt(x.innerHTML) && this.manager.tryParseInt(y.innerHTML)) {
        //                 if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
        //                     shouldSwitch = true;
        //                     break;
        //                 }
        //             } else {
        //                 if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        //                     // If so, mark as a switch and break the loop:
        //                     shouldSwitch = true;
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     if (shouldSwitch) {
        //         /* If a switch has been marked, make the switch
        //         and mark that a switch has been done: */
        //         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        //         switching = true;
        //         // Each time a switch is done, increase this count by 1:
        //         switchcount++;
        //     } else {
        //         /* If no switching has been done AND the direction is "asc",
        //         set the direction to "desc" and run the while loop again. */
        //         if (switchcount == 0 && dir == "asc") {
        //             dir = "desc";
        //             switching = true;
        //         }
        //     }
        // }
    }
}