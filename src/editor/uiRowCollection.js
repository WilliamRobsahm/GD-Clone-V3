import UIElement from "../ui/elements/uiElement.js";


export class UIRowCollection {
    /**
     * @param {UIElement} container 
     * @param {UIElement[]} rows 
     */
    constructor(container, rows) {
        this.container = container;
        this.rows = rows;
    }
}