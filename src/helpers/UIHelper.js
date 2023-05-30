


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
}