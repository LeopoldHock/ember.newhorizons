//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// This service manages messaging and logging. This includes the app log
// that can be observed in production, console-logging (only active during development)
// as well as messageToasts that can be seen by the user.
//----------------------------------------------------------------------------//
import Service from '@ember/service';
import ENV from 'new-horizons/config/environment';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MessageService extends Service {
    @service manager;
    @service localization;
    @service modalService;
    @service store;
    @service notifications;

    static messageType = {
        success: "success",
        information: "information",
        warning: "warning",
        error: "error",
        exception: "exception"
    };

    constructor(...args) {
        super(...args);
        let that = this;
        window.onerror = function (message, source, lineno, colno) {
            that.logMessage(message + " (at: '" + source + "', line: " + lineno + ", column: " + colno + ")", MessageService.messageType.exception);
        };
    }

    @action logMessage(messageText, messageType = MessageService.messageType.information) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // This method logs a message, decides where to do so and whether it should be
        // displayed to the user. Should not be called directly (use manager.log() instead).
        //----------------------------------------------------------------------------//
        this.store.createRecord("applog", { createdAt: this.getCurrentUTCTime(), type: messageType, text: messageText });
        if (ENV.environment === "development") {
            if (messageType === MessageService.messageType.exception || messageType === MessageService.messageType.error) {
                console.error(messageText);
            } else if (messageType === MessageService.messageType.warning) {
                console.warn(messageText);
            } else {
                console.log(messageText);
            }
        }
        if (messageType === MessageService.messageType.exception) {
            this.askForExceptionReport(messageText);
        }
    }

    @action askForExceptionReport(messageText) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-23
        // Description:
        // This method calls a modal that asks the user to report an exception that
        // has been raised. It is triggered when (1) logMessage() has been called
        // with messageType.exception and (2) whenever the browser throws an uncaught
        // exception (onerror event).
        //----------------------------------------------------------------------------//
        let that = this;
        let modalType = { "name": "type", "value": "error" };
        let modalTitle = { "name": "title", "value": "Misc_Sorry" };
        let modalText = { "name": "text", "value": ["modal/report-exception/text-01", "\"" + messageText + "\"", "modal/report-exception/text-02"] };
        let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
        let noLabel = { "name": "noLabel", "value": "Misc_No" };
        let yesListener = {
            "event": "click", "id": "modal-button-footer-yes", "function": function () {
                that.modalService.render("bug-report", [{ "name": "data.description", "value": messageText }]);
            }
        };
        let noListener = {
            "event": "click", "id": "modal-button-footer-no", "function": function () {
                that.modalService.hide();
            }
        };
        this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
    }

    @action showApplog() {
        this.manager.callModal("applog");
    }

    @action getApplog(maxEntries = undefined, asJson = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Returns the current log up to n entries and stringifies if required.
        //----------------------------------------------------------------------------//
        let result = [];
        let applog = this.store.peekAll("applog").toArray();
        for (let i = applog.length - 1; i >= 0; i--) {
            if (!applog[i] || (maxEntries && result.length >= maxEntries)) break;
            result.push(applog[i].serialize());
        }
        if (asJson) result = JSON.stringify(result);
        return result;
    }

    @action getCurrentUTCTime() {
        let d = new Date();
        let year = String(d.getUTCFullYear());
        let month = (d.getUTCMonth() + 1);
        if (month < 10) month = "0" + String(month);
        else month = String(month);
        let date = d.getUTCDate();
        if (date < 10) date = "0" + String(date);
        else date = String(date);
        let hours = d.getUTCHours();
        if (hours < 10) hours = "0" + String(hours);
        else hours = String(hours);
        let minutes = d.getUTCMinutes();
        if (minutes < 10) minutes = "0" + String(minutes);
        else minutes = String(minutes);
        let seconds = d.getUTCSeconds();
        if (seconds < 10) seconds = "0" + String(seconds);
        else seconds = String(seconds);
        let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return result;
    }

    /**
     * Displays a message as a notification at the bottom of the screen that fades out after the given amount of miliseconds.
     * @param {string} message - The message text.
     * @param {MessageService.messageType} type (optional) - The message type.
     * @param {number} (optional) - The duration in miliseconds for how long the snackbar should be displayed. Set to 0 to prevent autoClear.
     * @param {boolean} log (optional) - Should the message be added to the application log?
     */
    @action showNotification(message, { type = MessageService.messageType.information, duration = 3000, log = false } = {}) {
        let options = {
            autoClear: duration > 0,
            clearDuration: duration,
            cssClasses: `notification notification-${type}`
        };
        switch (type) {
            case MessageService.messageType.exception:
                this.notifications.error(message, options);
                break;
            case MessageService.messageType.error:
                this.notifications.error(message, options);
                break;
            case MessageService.messageType.warning:
                this.notifications.warning(message, options);
                break;
            case MessageService.messageType.success:
                this.notifications.success(message, options);
                break;
            default:
                this.notifications.info(message, options);
        }
        this.notifications;
        if (log) {
            this.logMessage(message, type);
        }
    }
}