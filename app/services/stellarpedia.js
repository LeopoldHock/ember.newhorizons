//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// This service manages Stellarpedia.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import ENV from 'new-horizons/config/environment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { set, action } from '@ember/object';
import MessageService from './message-service';

export default class StellarpediaService extends Service {
    @service manager;
    @service database;
    @service store;
    @service localization;

    namespace = "/assets/stellarpedia/stellarpedia_";
    defaultEntry = { bookId: "basic-rules", chapterId: "introduction", entryId: "welcome" };
    @tracked header;
    @tracked selectedBookId;
    @tracked selectedChapterId;
    @tracked selectedEntry = {};
    @tracked currentPosition;
    @tracked returnRoute = "home";
    @tracked data;
    @tracked sidebarData = [];

    constructor(...args) {
        super(...args);
    }

    async load() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Load and returns the Stellarpedia.
        //----------------------------------------------------------------------------//
        let result = this.store.peekAll("stellarpedia");
        if (result.content.length > 0) {
            return result;
        } else {
            let result = await this.store.findAll("stellarpedia");
            set(this, "data", result);
            return result;
        }
    }

    getStellarpediaElement(bookId, chapterId = undefined, entryId = undefined) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns a book and/or chapter and/or entry (chapterId and entryId are optional).
        //----------------------------------------------------------------------------//
        bookId = this.database.transformId(bookId);
        // convert ids if needed
        if (chapterId) chapterId = this.database.transformId(chapterId);
        if (entryId) entryId = this.database.transformId(entryId);
        var book = this.store.peekRecord("stellarpedia", bookId);
        if (!book) {
            this.manager.log("Stellarpedia book " + bookId + " does not exist.", MessageService.messageType.error);
            return null;
        }
        // if chapterId is supplied, continue to look for chapter, else return book
        if (!chapterId) {
            return book;
        } else {
            let chapter;
            book.chapters.forEach(function (element) {
                if (element.id === chapterId) {
                    chapter = element;
                }
            });
            if (!chapter) {
                this.manager.log("Stellarpedia chapter " + bookId + "/" + chapterId + " does not exist.", MessageService.messageType.error);
                return null;
            }
            // if entryId is supplied, continue to look for entry, else return chapter
            if (!entryId) {
                return chapter;
            } else {
                let entry;
                chapter.entries.forEach(function (element) {
                    if (element.id === entryId) {
                        entry = element;
                    }
                });
                if (!entry) {
                    this.manager.log("Stellarpedia entry " + bookId + "/" + chapterId + "/" + entryId + " does not exist.", MessageService.messageType.error);
                    return null;
                }
                return entry;
            }
        }
    }

    getEntryHeader(entry) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns an entry's header without tags.
        //----------------------------------------------------------------------------//
        if (entry.elements.length) {
            for (let i = 0; entry.elements.length; i++) {
                if (entry.elements[i].startsWith("[hdr]")) {
                    return this.prepareText(entry.elements[i]);
                }
            }
        }
        this.manager.log("Stellarpedia entry does not have a header element.");
        return null;
    }

    setSelectedEntry(bookId, chapterId, entryId) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Sets selectedEntry property.
        //----------------------------------------------------------------------------//
        try {
            let entry = this.getStellarpediaElement(bookId, chapterId, entryId);
            this.header = this.getEntryHeader(entry);
            this.selectedBookId = bookId;
            this.selectedChapterId = chapterId;
            this.selectedEntry = entry;
            this.currentPosition = this.manager.localize("stellarpedia/book/" + bookId) + " > " + this.getStellarpediaElement(bookId, chapterId).header + " > " + this.header;
            this.setSidebarSelectionState(bookId, chapterId, entryId);
            return true;
        } catch (exception) {
            this.manager.log("Unable to set Stellarpedia's selectedEntry (" + exception + ").", MessageService.messageType.exception);
        }
    }

    getElementType(element, bookId = "", chapterId = "", entryId = "") {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Return an element's type
        // Available types are: 'hdr' (Header element), 'txt' (Text element), 'spt' (Separator element),
        // 'spc' (Spacer element), 'img' (Image element) and 'row' (Table row element).
        //----------------------------------------------------------------------------//
        // Header element
        if (element.startsWith("[hdr")) {
            return "hdr";
        }
        // Separator element
        else if (element.startsWith("[spt")) {
            return "spt";
        }
        // Spacer element
        else if (element.startsWith("[spc")) {
            return "spc";
        }
        // Text element
        else if (element.startsWith("[txt")) {
            return "txt";
        }
        // Image element
        else if (element.startsWith("[img")) {
            return "img";
        }
        // Table row element
        else if (element.startsWith("[row")) {
            return "row";
        }
        // Missing element
        else if (element.startsWith("[mis]")) {
            return "mis";
        }
        // Element type not recognizable
        else {
            this.manager.log("Type of Stellarpedia element not recognizable: " + element + " (" + bookId + "/" + chapterId + "/" + entryId + ")");
            return null;
        }
    }

    prepareElement(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns the processes version of an element depending on its type.
        //----------------------------------------------------------------------------//
        let type = this.getElementType(element);
        let result;
        switch (type) {
            case "hdr": {
                result = element.substring(5, element.length);
                let localized = this.prepareText(element, true);
                if (!localized.startsWith("loc_miss:")) result = localized;
                break;
            }
            case "txt":
                result = this.prepareText(element, true);
                break;
            case "img":
                result = this.getImageUrl(element);
                break;
            case "row":
                result = this.prepareRow(element);
                break;
            case "mis":
                result = "";
                break;
            default:
                result = element;
                break;
        }
        return result;
    }

    prepareText(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns the processed version of a text element.
        //----------------------------------------------------------------------------//
        // remove tag
        let result = element;
        let split = element.split("]");
        if (split.length >= 2) {
            result = split[1];
            if (split.length > 2) {
                // if split.length > 2, there are [] brackets being used in the actual text which have not been split at
                for (let i = 2; i < split.length; i++) {
                    result = result + "]";
                    if (split[i]) result = result + split[i];
                }
            }
            // first, try to localize the whole text as a whole
            let locResult = this.manager.localize(result, true);
            if (locResult) {
                result = locResult;
            }
            // if this fails, proceed to process the text
            else {
                result = this.processText(split[1], split[0]);
            }
        } else {
            // syntax or formatting error, throw exception
            this.manager.log("Syntax error in Stellarpedia element: " + element, MessageService.messageType.exception);
        }
        return result;
    }

    processText(text, constructor = undefined) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-01
        // Description:
        // This method processes a raw Stellarpedia text and turns Stellarpedia tags
        // into HTML tags.
        //----------------------------------------------------------------------------//
        let result = text;
        // process constructor if it is supplied
        if (constructor) {
            let constructorSplit = constructor.split("(");
            if (constructorSplit[1]) {
                let paramsAsString = constructorSplit[1].replaceAll(/\)/g, "");
                let params = paramsAsString.split(";");
                for (let param of params) {
                    // check if parameter has a legit syntax
                    if (param.split("=").length === 2) {
                        // if color paramter is supplied
                        if (param.startsWith("col=")) {
                            let colorCode = param.split("=")[1];
                            result = "<p style='color:" + colorCode + "'>" + result + "</p>";
                        }
                    } else {
                        // else, throw error
                        this.manager.log("Parameter has invalid syntax: " + param, MessageService.messageType.exception);
                    }
                }
            }
        }
        // replace <hl> tags
        result = result.replaceAll(/<hl>/g, "<b><span class='highlighted'>");
        result = result.replaceAll(/<\/hl>/g, "</span></b>");
        // replace \n tags
        result = result.replaceAll(/\\n/g, "<br>");
        // process <dt> tags
        let dataRegex = /<dt>(.*?)<\/dt>/g;
        let dataMatches = [...result.matchAll(dataRegex)];
        for (let dataMatch of dataMatches) {
            let dataPath = dataMatch[1];
            let dataResult = this.database.getDataFromPath(dataPath);
            if (dataResult) {
                result = result.replace(dataMatch[0], dataResult);
            } else {
                result = result.replace(dataMatch[0], "data_miss::" + dataPath);
            }
        }
        // process <lc> tags
        let locRegex = /<lc>(.*?)<\/lc>/g;
        let locMatches = [...result.matchAll(locRegex)];
        for (let locMatch of locMatches) {
            result = result.replace(locMatch[0], this.manager.localize(locMatch[1]));
        }
        // process <link> tags
        let linkRegex = /<link=(.*?)<\/link>/g;
        let linkMatches = [...result.matchAll(linkRegex)];
        for (let linkMatch of linkMatches) {
            let linkPath = linkMatch[1].replaceAll("\"", "").split(">")[0];
            let linkText = linkMatch[1].replaceAll("\"", "").split(">")[1];
            if (!linkText) linkText = "";
            // if link contains an actual URL, replace with <a href=url>
            if (linkPath.startsWith("http") || linkPath.startsWith("mailto")) {
                result = result.replace(linkMatch[0], "<a href='" + linkPath + "'>" + linkText + "</a>");
            }
            // if not, extract article information and replace with <button>
            else {
                let entryUrl = linkPath;
                entryUrl = entryUrl.replaceAll(/"/g, "");
                result = result.replace(linkMatch[0], `<button type='button' class='button-link stellarpedia-link' data-target='${entryUrl}'>${linkText}</button>`);
            }
        }
        return result;
    }

    prepareRow(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-26
        // Description:
        // This method processes a table row element. Returns rowData object.
        //----------------------------------------------------------------------------//
        // remove tag
        let result = element;
        let split = element.split("]");
        if (split.length >= 2) {
            result = split[1];
            if (split.length > 2) {
                // if split.length > 2, there are [] brackets being used in the actual text which have not been split at
                for (let i = 2; i < split.length; i++) {
                    result = result + "]";
                    if (split[i]) result = result + split[i];
                }
            }
            let rowData = { isHeader: false, isLast: false, layout: [], alignment: [], content: [] };
            // process constructor
            let constructor = split[0];
            let constructorSplit = constructor.split("(");
            if (constructorSplit[1]) {
                let paramsAsString = constructorSplit[1].replaceAll(/\)/g, "");
                let params = paramsAsString.split(";");
                for (let param of params) {
                    // check if parameter has a legit syntax
                    if (param.split("=").length === 2) {
                        let argument = param.split("=")[1];
                        // 'header' parameter
                        if (param.startsWith("header=")) {
                            if (argument === "true") rowData.isHeader = true;
                        }
                        // 'last' parameter
                        else if (param.startsWith("last=")) {
                            if (argument === "true") rowData.isLast = true;
                        }
                        // 'layout' parameter
                        else if (param.startsWith("layout=")) {
                            let args = argument.split(",");
                            for (let arg of args) {
                                if (parseInt(arg)) {
                                    rowData.layout.push(parseInt(arg));
                                } else {
                                    // throw error due to invalid argument
                                    this.manager.log("Invalid argument '" + arg + "' for parameter 'layout' in Stellarpedia element: " + element, MessageService.messageType.exception);
                                }
                            }
                        }
                        // 'alignment' parameter
                        else if (param.startsWith("alignment=")) {
                            let args = argument.split(",");
                            for (let arg of args) {
                                if (arg === "l" || arg === "c" || arg === "r") {
                                    rowData.alignment.push(arg);
                                } else {
                                    // throw error due to invalid argument
                                    this.manager.log("Invalid argument '" + arg + "' for parameter 'alignment' in Stellarpedia element: " + element, MessageService.messageType.exception);
                                }
                            }
                        }
                        // else, throw error due to unknown parameter
                        else {
                            this.manager.log("Unknown paramer '" + param.split("=")[0] + "' in Stellarpedia element: " + element, MessageService.messageType.exception);
                        }
                    } else {
                        // else, throw error
                        this.manager.log("Parameter has invalid syntax: " + param, MessageService.messageType.exception);
                    }
                }
                // process cell content
                let cells = result.split("||");
                for (let cell of cells) {
                    rowData.content.push(cell);
                }
            }
            result = rowData;
        } else {
            // syntax or formatting error, throw exception
            this.manager.log("Syntax error in Stellarpedia element: " + element, MessageService.messageType.exception);
        }
        return result;
    }

    getImageUrl(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-26
        // Description:
        // This image processes an image element and returns the image's url.
        //----------------------------------------------------------------------------//
        let split = element.split("]");
        if (split.length > 1) {
            let url = ENV.APP.stellarpediaUrl + split[1].slice(13, split[1].length) + ".png";
            return url;
        } else {
            this.manager.log("Syntax error in Stellarpedia element: " + element, MessageService.messageType.exception);
            return undefined;
        }
    }

    getImageSubtitle(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-26
        // Description:
        // This image processes an image element and returns its subtitle.
        //----------------------------------------------------------------------------//
        let split = element.split("]");
        if (split.length >= 1) {
            let constructorSplit = split[0].split("(");
            if (constructorSplit.length > 1) {
                let subtitleParam = constructorSplit[1].split("=");
                if (subtitleParam.length > 1) {
                    let subtitle = subtitleParam[1];
                    // remove last char (closed ')')
                    subtitle = subtitle.slice(0, -1);
                    return subtitle;
                } else {
                    this.manager.log("Parameter has invalid syntax: " + subtitleParam, MessageService.messageType.exception);
                    return undefined;
                }
            } else {
                return "";
            }
        } else {
            this.manager.log("Syntax error in Stellarpedia element: " + element, MessageService.messageType.exception);
            return undefined;
        }
    }

    /**
     * Stellarpedia articles may require certain database collections to be loaded.
     * This method loads any collections required for the specified entry.
     * @param {string} bookId - The book id.
     * @param {string} chapterId - The chapter id.
     * @param {string} entryId - The entry id.
     */
    @action async loadRequiredDatabaseCollections(bookId, chapterId, entryId) {
        let entry = this.getStellarpediaElement(bookId, chapterId, entryId);
        if (entry) {
            switch (entry.type) {
                case "origin":
                    await this.database.loadCollection("origin");
                    await this.database.loadCollection("constant");
                    break;
                case "primary-attribute":
                    await this.database.loadCollection("pri-a");
                    await this.database.loadCollection("constant");
                    break;
                case "secondary-attribute":
                    await this.database.loadCollection("sec-a");
                    await this.database.loadCollection("pri-a");
                    await this.database.loadCollection("skill");
                    break;
                case "trait":
                    await this.database.loadCollection("trait");
                    break;
                case "skill":
                    await this.database.loadCollection("skill");
                    await this.database.loadCollection("pri-a");
                    break;
                case "ability":
                    await this.database.loadCollection("ability");
                    break;
                case "app":
                    await this.database.loadCollection("app");
                    break;

            }
            for (let element of entry.elements) {
                let type = this.getElementType(element);
                if (type === "hdr" || type === "txt" || type == "row") {
                    // find <dt> tags
                    let dataRegex = /<dt>(.*?)<\/dt>/g;
                    let dataMatches = [...element.matchAll(dataRegex)];
                    for (let dataMatch of dataMatches) {
                        let dataPath = dataMatch[1];
                        // get the name of the collection
                        let collectionName = dataPath.split(";")[1].split("/")[0];
                        await this.database.loadCollection(collectionName);
                    }
                }
            }
        }
    }

    @action onLinkClick(event) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-06
        // Description:
        // Listener function that handles stellarpedia text link clicks.
        //----------------------------------------------------------------------------//
        let target = event.originalTarget.getAttribute("data-target");
        let split = target.split(";");
        let entryAddress = { bookId: split[0], chapterId: split[1], entryId: split[2] };
        this.manager.showStellarpediaEntry(entryAddress.bookId, entryAddress.chapterId, entryAddress.entryId, { updateScrollPosition: true, closeSidebarsOnMobile: true });
        // tell the route to update the nav bar after the article has been rendered
    }

    @action loadIntoSidebarData(bookId, chapterId) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-07-10
        // Description:
        // Loads the given book or chapter into the sidebar data object so the
        // corresponding DOM elements can be rendered lazily.
        //----------------------------------------------------------------------------//
        if (this.sidebarData.length === 0) {
            for (let book of this.data.toArray()) {
                let sidebarBook = { id: book.id, faIcon: book.faIcon, chapters: [] };
                this.sidebarData.push(sidebarBook);
            }
        }
        let sidebarBook = this.sidebarData.find(book => book.id === bookId);
        if (sidebarBook.chapters?.length === 0) {
            let book = this.getStellarpediaElement(bookId);
            let chapters = [];
            for (let chapter of book.chapters) {
                chapters.push({ id: chapter.id, header: chapter.header, entries: [] });
            }
            set(sidebarBook, "chapters", chapters);
        }
        if (chapterId) {
            let sidebarChapter = sidebarBook.chapters.find(chapter => chapter.id === chapterId);
            if (sidebarChapter?.entries.length === 0) {
                let chapter = this.getStellarpediaElement(bookId, chapterId);
                let entries = [];
                for (let entry of chapter.entries) {
                    entries.push({ id: entry.id, elements: [entry.elements[0]] });
                }
                set(sidebarChapter, "entries", entries);
            }
        }
    }

    @action setSidebarSelectionState(bookId, chapterId, entryId, { state = true } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-07-10
        // Description:
        // Toggles the expanded/collapsed state of a sidebar object.
        //----------------------------------------------------------------------------//
        this.loadIntoSidebarData(bookId, chapterId);
        let book = this.sidebarData.find(book => book.id === bookId);
        set(book, "expanded", state);
        if (chapterId) {
            let chapter = book.chapters.find(chapter => chapter.id === chapterId);
            set(chapter, "expanded", state);
            if (entryId && state) {
                for (let otherBook of this.sidebarData) {
                    for (let otherChapter of otherBook.chapters) {
                        otherChapter.entries.forEach(function (entry) {
                            if (entry.id === entryId) {
                                set(entry, "selected", state);
                            } else {
                                set(entry, "selected", false);
                            }
                        });
                    }
                }
            }
        }
    }

    /**
     * Attempts to update the sidebar's scroll position
     * to focus the currently selected entry.
     */
    @action async setSidebarFocusToSelectedEntry() {
        let buttonId = `sidebar-button-${this.selectedEntry.path}`;
        let button = document.getElementById(buttonId);
        let leftSidebarContent = document.getElementById("leftSidebarContent");
        if (button && leftSidebarContent) {
            let offset = button.offsetTop - (leftSidebarContent.clientHeight / 2);
            if (offset <= leftSidebarContent.scrollHeight) {
                if (offset >= 0) {
                    leftSidebarContent.scrollTo(0, offset);
                } else {
                    leftSidebarContent.scrollTo(0, 0);
                }
            } else {
                leftSidebarContent.scrollTo(0, leftSidebarContent.scrollHeight);
            }
        }
    }
}