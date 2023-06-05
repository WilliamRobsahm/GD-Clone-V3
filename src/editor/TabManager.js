import ScrollableItemList from "../misc/ScrollableItemList.js";
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

export class TabManager {
    constructor() {
        this.tabs = null;

        this.activeTab = "BUILD";
        this.selectedObjectType = "BLOCKS";
    }

    initialize() {
        this.tabs = {
            BUILD: new ScrollableItemList(),
            EDIT: new ScrollableItemList(),
            DELETE: new ScrollableItemList(),
        }

        this.objectTabs = {
            BLOCKS: new ObjectTab("BLOCKS", "default_block"),
            PLATFORMS: new ObjectTab("PLATFORMS"),
            SPIKES: new ObjectTab("SPIKES", "default_spike"),
        }

        for(const tabname in OBJECTS) {
            this.objectTabs[tabname].addObjects(OBJECTS[tabname]);
        }

        this.tabs.BUILD = this.objectTabs[this.selectedObjectType].pages;
    }

    selectObjectTab(tabname) {
        if(this.activeTab !== "BUILD") return;

        // Every "Object tab" stores its own ScrollableItemList object with all the pages and object selectors.
        // When an object tab is selected, tabs.BUILD is replaced with the object tab's pages.
        this.getActiveContainer().setVisible(false);
        this.selectedObjectType = tabname;
        this.tabs.BUILD = this.objectTabs[tabname].pages;
        this.getActiveContainer().setVisible(true);
    }

    getTab(tabname) {
        return this.tabs[tabname];
    }

    getActiveTab() {
        return this.getTab(this.activeTab);
    }

    getActivePage() {
        return this.getActiveTab().getActiveItem();
    }

    getActiveContainer() {
        const page = this.getActivePage();
        return page ? page.container : null;
    }

    getActiveRows() {
        const page = this.getActivePage();
        return page ? page.rows : null;
    }

    getCurrentPageCount() {
        return this.getActiveTab().itemList.length;
    }
}

export const tabManager = new TabManager();