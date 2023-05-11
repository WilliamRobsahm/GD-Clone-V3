
export default class PageBase {
    constructor(name) {
        this.name = name;
    }

    init() {
        console.log("loading page " + this.name);
    }

    handleInput() {
        
    }
}