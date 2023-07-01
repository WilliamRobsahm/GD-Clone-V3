import { UIRowCollection } from "../editor/uiRowCollection.js";

export default class UIHelper {

    /**
     * Takes a number with a unit and return its equivalent pixel count.
     * Supported units: "px", "%"
     * @param {string} size Number with unit (ex. "100px", "20%")
     * @param {string} parentSize Full size of parent element. Used for % units.
     */
    static sizeToPx(size, parentSize = 0) {
        if(!size) return 0;
        if(typeof size == "number") return size;
        if(size.includes("px")) {
            return parseInt(size.replace("px", ""));
        } else if(size.includes("%")) {
            let percentage = parseInt(size.replace("%", ""));
            return parentSize * (percentage / 100);
        }
        return 0;
    }

    static sumElementWidth(elementList, spacing = 0) {
        let sum = 0;
        elementList.forEach(elem => {
            if(elem.position != "RELATIVE" || !elem.visible) return;
            sum += elem.getWidth() + elem.getOffsetX();
        })
        sum += spacing * (elementList.length + 1);
        return sum;
    }

    static sumElementHeight(elementList, spacing = 0) {
        let sum = 0;
        elementList.forEach(elem => {
            if(elem.position != "RELATIVE" || !elem.visible) return;
            sum += elem.getHeight() + elem.getOffsetY();
        })
        sum += spacing * (elementList.length + 1);
        return sum;
    }

    static getWidestElement(elementList) {
        let widest = 0;
        elementList.forEach(elem => {
            widest = Math.max(elem.getWidth() + elem.getOffsetX(), widest);
        });
        return widest;
    }

    static getTallestElement(elementList) {
        let tallest = 0;
        elementList.forEach(elem => {
            tallest = Math.max(elem.getHeight() + elem.getOffsetY(), tallest);
        });
        return tallest;
    }

    static swapVisibility(element1, element2) {
        let e1v = element1.visible;
        let e2v = element2.visible;
        element1.setVisible(e2v);
        element2.setVisible(e1v);
    }

    /**
     * Quite a complex function. I have a feeling that trying to understand how it works half a year from now will suck ass.
     * Anyway. It returns a list of UIRowCollections (pages), each containing rows, containing other elements.
     * 
     * Required properties:
     *      itemsPerRow {number}
     *      rowsPerPage {number}
     *      itemData {array} Contains information about each item, which is sent back to getItemFn()
     *      getItemFn {function} Must return a UIElement object.
     *      getRowFn {function} Must return a UIElement object.
     *      getContainerFn {function} Must return a UIElement object.
     * 
     * @param {object} params
     * @returns {UIRowCollection[]}
     */
    static getFilledPageList(params) {
        let index = 0;
        let rowIndex = 0;
        let pageIndex = 0;

        const newEmptyRow = () => { return params.getRowFn(pageList[pageIndex].container) }
        const newEmptyPage = () => { return new UIRowCollection(params.getContainerFn(), []) }

        let pageList = [newEmptyPage()]
        let rowList = [newEmptyRow()];

        for(let i = 0; i < params.itemData.length; i++) {
            let data = params.itemData[i];

            // Check if row is full
            if(index - (rowIndex * params.itemsPerRow) >= params.itemsPerRow) {
                // Check if page is full
                if(rowIndex - (pageIndex * params.rowsPerPage >= params.rowsPerPage)) {
                    pageList[pageIndex].rows = rowList;
                    pageList.push(newEmptyPage());
                    pageIndex++;
                    rowList = [newEmptyRow()];
                    rowIndex = 0;
                } else {
                    rowList.push(newEmptyRow());
                    rowIndex++;
                }
            }

            let item = params.getItemFn(rowList[rowIndex], data);
            index++;
        }

        pageList[pageIndex].rows = rowList;
        console.log(pageList);
        return pageList;
    }
}