import Reminder from './Reminder';

/**
 * A grouping of reminders based on tag (case-insensitive)
 */
export interface RemindersGroupingByTag {
    [tag: string]: Reminder[];
}

/**
 * @class RemindersHandler
 * @description Represents a handler that manages a list of reminders
 */
export default class RemindersHandler {
    private _reminders: Reminder[];

    /**
     * Creates a new RemindersHandler instance with no reminders.
     */
    constructor() {
        this._reminders = [];
    }

    /**
     * Returns the list of reminders added so far.
     */
    public get reminders(): Reminder[] {
        return this._reminders;
    }

    /**
     * Creates a new reminder and adds it to the list of reminders.
     * @param description - The full description of the reminder
     * @param tag - The keyword used to help categorize the reminder
     */
    public addReminder(description: string, tag: string): void {
        const reminder = new Reminder(description, tag);
        this._reminders.push(reminder);
    }

    /**
     * Returns the reminder at the specified index.
     * @throws ReminderError if the specified index is not valid
     * @param index - The index of the reminder
     */
    public getReminder(index: number): Reminder {
        if (this.isIndexValid(index)) {
            return this.reminders[index];
        } else {
            throw new Error("ReminderError: Invalid index");
        }
    }

    /**
     * Returns true if the specified index is valid, false otherwise.
     * @param index - The position of the reminder in the list of reminders
     */
    public isIndexValid(index: number): boolean {
        if (this.size() === 0) return false;
        if (index < 0 || index >= this.size()) return false;
        return true;
    }

    /**
     * Returns the number of reminders added so far.
     */
    public size(): number {
        return this._reminders.length;
    }

    /**
     * Modifies the description of the reminder at a specified index.
     * Silently ignores the call if the index is not valid.
     * @param index - The index of the reminder
     * @param description - The full description of the reminder
     */
  /**
 * Modifies the description of the reminder at a specified index.
 * Silently ignores the call if the index is not valid.
 * @param index - The index of the reminder
 * @param description - The full description of the reminder
 */
/**
 
 */
public modifyReminder(index: number, description: string): void {
    if (this.isIndexValid(index)) {
       
        if (index >= 0 && index < this.reminders.length) {
            this.reminders[index] = this.reminders[index] || {};
            this.reminders[index].description = description;
        }
    }
}


    /**
     * Toggle the completion status of the reminder at the specified index.
     * Silently ignores the call if the index is not valid.
     * @param index - The index of the reminder
     */
    public toggleCompletion(index: number): void {
        if (this.isIndexValid(index)) {
            this.reminders[index].toggleCompletion();
        }
    }

    /**
     * Returns a list of reminders that match the keyword.
     * All reminders with tags that match the search keyword exactly will be returned first.
     * If none exist, then all reminders with descriptions that match the search keyword (even partially)
     * are returned.
     * @param keyword - Text to search for in description and tag
     */
    public search(keyword: string): Reminder[] {
        const matchingByTags = this.searchTags(keyword);
        const matchingByDescriptions = this.searchDescriptions(keyword);

        // Return unique reminders, avoiding duplicates
        return [...new Set([...matchingByTags, ...matchingByDescriptions])];
    }

    /**
     * Returns a grouping of the reminders based on tags (case-insensitive).
     */
    public groupByTag(): RemindersGroupingByTag {
        const groupings: RemindersGroupingByTag = {};

        // Pseudocode: Group the reminders by tags
        this.reminders.forEach(reminder => {
            const tag = reminder.tag.toLowerCase();
            if (!groupings[tag]) {
                groupings[tag] = [];
            }
            groupings[tag].push(reminder);
        });

        return groupings;
    }

    /**
     * Returns a list of reminders with tags that match the keyword exactly.
     * @param keyword - Text to search for in description and tag
     */
    private searchTags(keyword: string): Reminder[] {
        const matchingReminders: Reminder[] = this.reminders.filter(reminder =>
            reminder.tag.toLowerCase().includes(keyword.toLowerCase())
        );
        return matchingReminders;
    }

    /**
     * Returns a list of reminders with descriptions that match the keyword.
     * @param keyword - Text to search for in description and tag
     */
    private searchDescriptions(keyword: string): Reminder[] {
        const matchingReminders: Reminder[] = this.reminders.filter(reminder =>
            reminder.description.toLowerCase().includes(keyword.toLowerCase())
        );
        return matchingReminders;
    }
}
