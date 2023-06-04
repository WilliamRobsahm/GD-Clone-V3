import { isValidListIndex, navigateThroughItems } from "../helpers/helper.js";

/**
 * Name might be temporary. I have no fucking idea what to name this.
 * A ScrollableItemList contains an array of items. One of these items is marked as "Active" at all times.
 * The list can be scrolled through.
 */
export default class ScrollableItemList {
    constructor() {
        this.itemList = [];
        this.activeItem = 0;
    }

    /**
     * Increase or decrease 'activePage' by a certain amount.
     * If 'activePage' goes out of range of the item list, it goes to the other end of the list.
     * @param {number} n Amount to shift activeItem by.
     * @returns {object} previous and new active indexes
     */
    shift(n) {
        let prev = this.activeItem;
        this.activeItem = navigateThroughItems(this.activeItem, n, this.itemList.length);

        return {
            previous: prev,
            new: this.activeItem,
        }
    }

    setItems(itemList) {
        this.itemList = itemList;
    }

    addItem(item) {
        this.itemList.push(item);
    }

    getCount() {
        return this.itemList.length;
    }

    getItem(index) {
        if(!isValidListIndex(this.itemList, index)) return null;
        return this.itemList[index];
    }
    
    getActiveItem() {
        if(!isValidListIndex(this.itemList, this.activeItem)) return null;
        return this.itemList[this.activeItem];
    }
}