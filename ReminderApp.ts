import readlineSync from "readline-sync";
import Logger from "./util/ReminderLogger";
import RemindersHandler from "./RemindersHandler";

/**
 * @class ReminderApp
 * @description Represents the class that handles the overall logic of the app
 */
export default class ReminderApp {
    private _remindersHandler: RemindersHandler;

    /**
     * Creates a new instance of the reminder application.
     */
    constructor() {
        this._remindersHandler = new RemindersHandler();
    }

    /**
     * Starts application and continually prompts the user to choose from one of six menu items.
     */
    public start(): void {
        let exitFlag = false;
        for (;;) {
            const item: string = ReminderApp.handleMenuSelection();
            switch (item) {
                case "1":
                    this.handleShowReminders();
                    break;

                case "2":
                    this.handleSearchReminders();
                    break;

                case "3":
                    this.handleAddReminder();
                    break;

                case "4":
                    this.handleModifyReminders();
                    break;

                case "5":
                    this.handleToggleCompletion();
                    break;

                default:
                    exitFlag = true;
                    break;
            }
            if (exitFlag) break;
        }
        Logger.log("\n  ❌  Exited application\n");
    }

    /**
     * Interfaces with the user to toggle the completion status of a specific reminder.
     */
    private handleToggleCompletion(): void {
        if (this._remindersHandler.size() === 0) {
            Logger.log('\n  ⚠️  You have no reminders');
        } else {
            Logger.logReminders(this._remindersHandler.reminders);
            const reminderIndex = parseInt(this.getUserChoice("Reminder to toggle", true));
            this._remindersHandler.toggleCompletion(reminderIndex);
            Logger.log('\n  🏁   Reminder Completion Toggled');
        }
        /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        (1) Display all reminders (Logger.logReminders)
        (2) Ask User to choose a reminder number to toggle (this.getUserChoice)
        (3) Take result from (2) and toggle that reminder's completion (this._remindersHandler.toggleCompletion)
        (4) Logger.log('\n  🏁   Reminder Completion Toggled');
        */
    }

    /**
     * Interfaces with the user to modify a specific reminder.
     */
    private handleModifyReminders(): void {
        if (this._remindersHandler.size() === 0) {
            Logger.log('\n ⚠️  You have no reminders');
        } else {
            Logger.logReminders(this._remindersHandler.reminders);
            const editReminderIndex = parseInt(this.getUserChoice("Reminder to modify", false));
            const newDescription = this.getUserChoice("New Reminder Description", false);
            this._remindersHandler.modifyReminder(editReminderIndex, newDescription);
            Logger.log('\n  🏁  Reminder Modified');
        }
        /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        (1) Display all reminders (Logger.logReminders)
        (2) Ask User to choose a reminder number to edit (this.getUserChoice)
        (3) Ask User for a new reminder description (this.getUserChoice)
        (4) Take result from (2) and (3) and modify the reminder (this._remindersHandler.modifyReminder)
        (5) Logger.log('\n  🏁   Reminder Modified');
        */
    }

    /**
     * Interfaces with the user to add a reminder.
     */
    private handleAddReminder(): void {
        const description = this.getUserChoice("Reminder", false);
        const addTag = this.getUserChoice("tag", false);
        this._remindersHandler.addReminder(description, addTag);
        Logger.log('\n  🏁  Reminder Added');
        /*
        Pseudocode:
        (1) Ask User to enter a reminder (description) (this.getUserChoice)
        (2) Ask User to enter a tag (this.getUserChoice)
        (3) Take results from (1) and (2) and add a reminder (this._remindersHandler.addReminder)
        (4) Logger.log('\n  🏁  Reminder Added');
        */
    }

    /**
     * Finds and logs all reminders with a tag that matches the keyword exactly.
     * If none exists, then all reminders with descriptions that match the search keyword (even partially)
     * are logged instead.
     */
    private handleSearchReminders(): void {
        if (this._remindersHandler.size() === 0) {
            Logger.log('\n  ⚠️  You have no reminders');
        } else {
            const searchKeyword = this.getUserChoice("search keyword", false);
            const searchResults = this._remindersHandler.search(searchKeyword);
            Logger.logSearchResults(searchResults);
        }
        /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        (1) Ask User to enter a search keyword (this.getUserChoice)
        (2) Feed the results to Logger.logSearchResults <- the results of this._remindersHandler.search(keyword)
        BREAKDOWN OF: this._remindersHandler.search(keyword)
        - First call this.searchTags(keyword) to see if you have a matching tag
        - If not, then call this.searchDescriptions(keyword) and look through each
        individual reminder.
        */
    }

    /**
     * Logs any existing reminders to the console, grouped by tags.
     */
    private handleShowReminders(): void {
        if (this._remindersHandler.size() === 0) {
            Logger.log('\n ⚠️  You have no reminders');
        } else {
            console.log(this._remindersHandler.reminders);
            Logger.logGroupedReminders(this._remindersHandler.groupByTag());
        }
        /*
        Pseudocode:
        If no reminders then -> Logger.log('\n  ⚠️  You have no reminders');
        otherwise
        (1) Logger.logGroupedReminders(this._remindersHandler.groupByTag());
        */
    }

    /**
     * Returns verified user input based on the Main Menu item selected.
     * @param question - Text that describes what to ask the user
     * @param isIndexRequired - True if the user chooses to either modify or toggle a reminder, otherwise false
     */
    private getUserChoice(question: string, isIndexRequired: boolean): string {
        let userChoice: string;
        for (;;) {
            userChoice = readlineSync.question(`\nEnter a ${question} here: `, {
                limit: (input: string) => {
                    return this.validateInput(input, isIndexRequired);
                },
                limitMessage: "",
            });
            const userDecision: string = this.checkUserChoice(question, userChoice);
            if (userDecision === "n") Logger.log("\n  🔄  Please try typing it again");
            else break;
        }
        return userChoice;
    }

    /**
     * Verifies user input and returns 'y' if the input is accepted by the user, otherwise 'n'.
     * @param question - Portion of the question to prompt with, based on the Main Menu item selected
     * @param userChoice - Text that the user enters
     */
    private checkUserChoice(question: string, userChoice: string): string {
        return readlineSync
            .question(`You entered ${question}: '${userChoice}', is it correct? y/n: `, {
                limit: /^[YNyn]{1}$/,
                limitMessage: "\n  🚨  Invalid input: Please enter either y/n.\n",
            })
            .toLowerCase();
    }

    /**
     * Validates if the user's input is valid for the selected menu item.
     * @param input - The text the user enters
     * @param isIndexRequired - True if the user chooses to either modify or toggle a reminder, otherwise false
     */
    private validateInput(input: string, isIndexRequired: boolean): boolean {
        if (!input) {
            Logger.log(`\n  🚨  Input cannot be blank: Please try again.\n`);
            return false;
        }
        if (isIndexRequired) {
            if (ReminderApp.matches(/^\d+$/, input)) {
                const index: number = Number(input) - 1;
                if (this._remindersHandler.isIndexValid(index)) return true;
                Logger.log(`\n  🚨  Input must be a number from the list of reminders: Please try again.\n`);
                return false;
            }
            Logger.log(`\n  🚨  Input must be a positive number from the list of reminders: Please try again.\n`);
            return false;
        }
        return true;
    }

    /**
     * Returns true if text matches the RegExp pattern, otherwise false.
     * @param regex - Pattern used to match text
     * @param str - Text to match
     */
    private static matches(regex: RegExp, str: string): boolean {
        return regex.test(str);
    }

    /**
     * Returns the menu item number that the user selects.
     * Keeps prompting the user until the item is valid (between 1 and 6 inclusive).
     */
    private static getMenuItem(): string {
        const item: string = readlineSync.question("Choose a [Number] followed by [Enter]: ", {
            limit: ["1", "2", "3", "4", "5", "6"],
            limitMessage: "\n  🚨  Sorry, input is not a valid menu item.\n",
        });
        return item;
    }

    /**
     * Prompts the user to return to the Main Menu.
     */
    private static handleMenuSelection(): string {
        readlineSync.question("\nHit [Enter] key to see the main menu: ", { hideEchoBack: true, mask: "" });
        Logger.logMenu();
        return ReminderApp.getMenuItem();
    }
}

