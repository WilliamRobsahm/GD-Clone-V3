import ObjectTab from "./ObjectTab.js";

const OBJECTS = {
    BLOCKS: [
        "default_block",
    ],
    PLATFORMS: [],
    SPIKES: [
        "default_spike",
    ],
}

export class ObjectTabManager {
    constructor() {
        this.tabs = null;
        this.activeTab = "BLOCKS";
    }

    initialize() {
        this.tabs = {
            BLOCKS: new ObjectTab("BLOCKS", "default_block"),
            PLATFORMS: new ObjectTab("PLATFORMS"),
            SPIKES: new ObjectTab("SPIKES", "default_spike"),
        }

        for(const tabname in OBJECTS) {
            this.getTab(tabname).addObjects(OBJECTS[tabname]);
        }
    }

    getTab(tabname) {
        return this.tabs[tabname];
    }

    getActiveTab() {
        return this.getTab(this.activeTab);
    }

    getActiveTabPage() {
        return this.getActiveTab().getActivePage();
    }

    getActivePageRows() {
        return this.getActiveTab().getActivePageRows();
    }

    getCurrentPageCount() {
        return this.getActiveTab().pages.length;
    }
}

export const objectTabManager = new ObjectTabManager();